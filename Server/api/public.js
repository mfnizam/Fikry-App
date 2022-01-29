const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const multer = require('multer');
const request = require('request');

//moduls
const m = require('../module');

// models
const User = require('../models/user');
const Bayar = require('../models/bayar');
const Pembayaran = require('../models/pembayaran');
const Tagihan = require('../models/tagihan');
const Rekening = require('../models/rekening');

// other server url
const otherServerUrl = "https://mfnizam.com/apps/projectone/";

router.post('/tagihan', (req, res) => {
	let idUser = req.body.idUser;

	if(!idUser) res.json({success: false, msg: 'Mohon Isikan Data User'});

	m.customeModelAggregate(User, [{
		$match: { _id: ObjectId(idUser) }
	},{
		$lookup: {
			from: 'siswas',
			localField: 'siswa',
			foreignField: '_id',
			as: 'siswa'
		}
	},{
		$project: {siswa: 1, _id: 0}
	},{
		$unwind: '$siswa'
	},{
		$lookup: {
			from: 'bayars',
			localField: 'siswa._id',
			foreignField: 'siswa',
			as: 'bayar'
		}
	},/*{
		$addFields: {
			bayar: {
				$map: {
					input: "$bayar",
					as: "t",
					in:  '$$t.tagihan'
				}
			}
		}
	},*/{
		$lookup: {
			from: 'pembayarans',
			pipeline: [{
				$match: {
					user: ObjectId(idUser)
				}
			}],
			as: 'pembayaran'
		}
	},{
		$addFields: {
			'pembayaran': {
				$reduce: {
					input:  '$pembayaran',
					initialValue: [],
					in: { 
						$concatArrays: ['$$value', '$$this.tagihan']
					}
				}
			}
		}
	},{
		$addFields: {
			pembayaran: {
				$filter: {
					input: "$pembayaran",
					as: 'fp',
					cond: {
						$eq: ["$$fp.siswa", "$siswa._id"]
					}
				}

			}
		}
	},{
		$lookup: {
			from: 'tagihans',
			let: { 
				siswaKelas: '$siswa.kelas',
				bayarTagihan: '$bayar',
    		pembayaranTagihan: '$pembayaran' 
			},
			pipeline: [
			{ 
				$match: {
					$expr: { 
						$and: [{ 
              $or: [{
                $eq: ['$delete', false]
              },{
                $lt: ["$delete", null]
              }]
            },{ 
							$in: [ '$$siswaKelas', "$kelas" ] 
						},
						{ 
							$not: [{ $in: [ '$_id', "$$bayarTagihan.tagihan" ] }] 
						},{
              $not: [{ $in: ['$_id', '$$pembayaranTagihan._id'] }]
            }] 
					}
				} 
			}
			],
			as: 'tagihan'
		}
	},{
		$unwind: '$tagihan'
	},{
		$addFields: { 'tagihan.siswa': '$siswa' }
	}, {
		$replaceRoot: { newRoot: '$tagihan' }
	},{
		$lookup: {
			from: 'kelas',
			localField: 'siswa.kelas',
			foreignField: '_id',
			as: 'siswa.kelas'
		}
	},{
		$lookup: {
			from: 'kategoris',
			localField: 'kategori',
			foreignField: '_id',
			as: 'kategori'
		}
	},{
		$addFields: {
			'siswa.kelas' : {
				$arrayElemAt: ['$siswa.kelas', 0]
			},
			'kategori': {
				$arrayElemAt: ['$kategori', 0]
			}
		}
	}], (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, tagihan: data});
	})
})
router.post('/tagihan/histori', (req, res) => {
	let idUser = req.body.idUser;

	if(!idUser) res.json({success: false, msg: 'Mohon Isikan Data User'});
	m.customeModelFindByQuerySelectPopulate(Pembayaran, { user: idUser, status: 2 }, ['tagihan', '-_id'], ['tagihan.siswa', 'tagihan.kelas', 'tagihan.kategori'], (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, histori: data.reduce((a, c) => c.tagihan? [...a, ...c.tagihan] : a, [])})
	})
})

router.post('/bayar', (req, res) => {
	let idUser = req.body.idUser;

	if(!idUser) return res.json({success: false, msg: 'Data bayar tidak lengkap'});

	m.customeModelAggregate(Bayar, [{
		$match: {user: ObjectId(idUser)}
	}, {
		$lookup: {
			from: 'tagihans',
			let: { tagihan: '$tagihan'},
			pipeline: [{
				$match: {
					$expr: {
						$and: [
						{ 
							$or: [{
								$eq: ['$delete', false]
							},{
								$lt: ["$delete", null]
							}]
						},
						{ $eq: ['$_id', '$$tagihan']}
						]
					}
				}
			}],
			// localField: 'tagihan',
			// foreignField: '_id',
			as: 'tagihan'
		}
	}, {
		$match : {
			$expr: { $gt: [ {$size: "$tagihan" }, 0 ]}
		}
	}, {
		$addFields: {
			tagihan: {
				$arrayElemAt: ['$tagihan', 0]
			}
		}
	}, {
		$lookup: {
			from: 'siswas',
			localField: 'siswa',
			foreignField: '_id',
			as: 'tagihan.siswa'
		}
	}, {
		$addFields: {
			'tagihan.siswa': {
				$arrayElemAt: ['$tagihan.siswa', 0]
			}
		}
	}, {
		$replaceRoot: {
			newRoot: '$tagihan'
		}
	}, {
		$lookup: {
			from: 'kategoris',
			localField: 'kategori',
			foreignField: '_id',
			as: 'kategori'
		}
	}, {
		$addFields: {
			'kategori': {
				$arrayElemAt: ['$kategori', 0]
			}
		}
	}, {
		$lookup: {
			from: 'kelas',
			localField: 'siswa.kelas',
			foreignField: '_id',
			as: 'siswa.kelas'
		}
	}, {
		$addFields: {
			'siswa.kelas': {
				$arrayElemAt: ['$siswa.kelas', 0]
			}
		}
	}], (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, bayar: data});
	})
})
router.post('/bayar/tambah', (req, res) => {
	let idUser = req.body.idUser,
	idTagihan = req.body.idTagihan,
	idSiswa = req.body.idSiswa;

	if(!idUser || !idTagihan || !idSiswa) return res.json({success: false, msg: 'Data bayar tidak lengkap'});

	let newBayar = new Bayar({
		user: idUser,
		tagihan: idTagihan,
		siswa: idSiswa
	})

	m.generalCreateDoc(newBayar, (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, data: data})
	})
})
router.post('/bayar/nanti', (req, res) => {
	let idTagihan = req.body.idTagihan,
	idSiswa = req.body.idSiswa;

	if(!idTagihan || !idSiswa) return res.json({success: false, msg: 'Data bayar tidak lengkap'});

	m.customeModelDeleteOneByQuery(Bayar, {tagihan: idTagihan, siswa: idSiswa}, (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, data: data})
	})
})
router.post('/bayar/pembayaran', (req, res) => {
	let idUser = req.body.idUser,
	bayar = req.body.bayar,
	rekening = req.body.rekening;
	
	if(!idUser || !bayar) return res.json({success: false, msg: 'Data pembayaran tidak lengkap'});
	// return res.json({success: false, bayar: bayar.map(v => { v['user'] = idUser; return v})});

	m.customeModelAggregate(Tagihan, [{
		$match: {
			// _id: { $in: bayar.map(v => ObjectId(v.tagihan))}
			$expr: {
				$and: [{
					$or: [{
						$eq: ['$delete', false]
					},{
						$lt: ["$delete", null]
					}]
				}, {
					$in: [ '$_id', bayar.map(v => ObjectId(v.tagihan))]
				}]
			} 
		}
	}, {
		$addFields: {
			'siswa': {
				$filter: {
					input: bayar.map(v => { 
						v.tagihan = ObjectId(v.tagihan)
						v.siswa = ObjectId(v.siswa)
						return v;
					}),
					as: 'v',
					cond: {
						"$eq": ["$$v.tagihan", '$_id']
					}
				}
			}
		}
	}, {
		$unwind: '$siswa'
	}, {
		$addFields: {
			'siswa': '$siswa.siswa'
		}
	}, {
		$lookup: {
			from: 'siswas',
			localField: 'siswa',
			foreignField: '_id',
			as: 'siswaBackup'
		}
	}, {
		$addFields: {
			'siswaBackup': {
				$arrayElemAt: ['$siswaBackup', 0]
			}
		}
	}, {
		$lookup: {
			from: 'kelas',
			localField: 'kelas',
			foreignField: '_id',
			as: 'kelasBackup'
		}
	}, {
		$addFields: {
			'kelasBackup': {
				$arrayElemAt: ['$kelasBackup', 0]
			}
		}
	}, {
		$addFields: {
			kelas: '$siswaBackup.kelas'
		}
	}, {
		$lookup: {
			from: 'kategoris',
			localField: 'kategori',
			foreignField: '_id',
			as: 'kategoriBackup'
		}
	}, {
		$addFields: {
			'kategoriBackup': {
				$arrayElemAt: ['$kategoriBackup', 0]
			}
		}
	},], (err, data) => {
		if(err) return res.status(500).send({ error : err });
		if(!data || data.length < 1) return res.json({success: false, msg: 'Gagal Menyimpan Pembayaran'});

		m.customeModelFindById(Rekening, rekening, (err, rekdata) => {
			if(err) return res.status(500).send({ error : err });
			if(!rekdata) return res.json({success: false, msg: 'No Rekening Tidak Terdaftar'});

			let ndate = Date.now();
			let tgl = new Date(ndate);
			let pembayaran = new Pembayaran({
				invoice: 'INV/' + ('0' + tgl.getDate()).slice(-2) + '/' + ('0' + (tgl.getMonth()+1)).slice(-2) + '/' + tgl.getFullYear() + '/' + ndate,
				nominal: data.reduce((a, c) => a + c.nominal, 0),
				user: idUser,
				tagihan: data,
				rekening: rekening,
				rekeningBackup: rekdata
			});

			m.generalCreateDoc(pembayaran, (err, data) => {
				if(err) return res.status(500).send({ error : err });
				// return res.json({success: true, pembayaran})

				m.customeModelDeleteByQuery(Bayar, { 
					$or: bayar.map(v => { v['user'] = idUser; return v 
				})}, (err, rdata) => {
					if(err) return res.status(500).send({ error : err });
					
					return res.json({success: true, pembayaran: data});
				})
			})
		})

	})
})

router.post('/pembayaran', (req, res) => {
	let idUser = req.body.idUser;

	m.customeModelFindByQueryPopulate(
		Pembayaran, 
		{ user: idUser, status: {$in: [0, 1, 3]} },
		['tagihan.kelas', 'tagihan.kategori', 'rekening'], 
		(err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, pembayaran: data})
	})
})
router.post('/pembayaran/histori', (req, res) => {
	let idUser = req.body.idUser;

	m.customeModelFindByQueryPopulate(
		Pembayaran, 
		{ user: idUser, status: 2 },
		['tagihan.kelas', 'tagihan.kategori'], 
		(err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, histori: data})
	})
})
router.post('/pembayaran/bukti/upload', multer().single('foto'), (req, res) => {
	let idUser = req.body.idUser,
			idPembayaran = req.body.idPembayaran,
			file = req.file,
			path = 'images/pembayaran/bukti';

	if (!file) {
    return res.status(500).json({success: false, msg: "Mohon Sertakan Foto Bukti Pembayaran"})
  }

  const reqOptions = {
	  url: otherServerUrl + 'upload.php',
    method: "POST",
    formData: {
      file: {
          value: req.file.buffer,
          options: {
              filename: req.file.originalname,
              contentType: req.file.mimetype
          }
      },
      destination : path,
      idUser: idUser
    }
	}

	request(reqOptions, function (err, resp, body) {
		if(err) return res.status(500).json({error: err});
		try{
			body = JSON.parse(body);
		}catch(e){
			body = {};
			body.success = false;
			body.err = 'Gagal parse json'
		}

		if(!body.success) return res.json({ success: false, errupload: true, err: body.err, file: body});

		m.customeModelUpdateByQuery(
			Pembayaran, 
			{_id: idPembayaran, user: idUser}, 
			{ $push: { buktiPembayaran:  { verify: 0, imgUrl: body.path }}, status: 1}, 
			{new: true}, 
			(err, data) => {
			if(err) return res.status(500).json({error: err});
			
			return res.json({success: true, pembayaran: data})
		})
	})
})

module.exports = router;