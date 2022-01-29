const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

//moduls
const m = require('../module');

// models
const User = require('../models/user');
const Kategori = require('../models/kategori');
const Kelas = require('../models/kelas');
const Siswa = require('../models/siswa');
const Tagihan = require('../models/tagihan');
const Pembayaran = require('../models/pembayaran');
const Rekening = require('../models/rekening');

router.post('/kategori', (req, res) => {
	m.customeModelFindByQuery(Kategori, {}, (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, kategori: data})
	})
})
router.post('/kategori/tambah', (req, res) => {
	let title = req.body.title;

	if(!title) return res.json({success: false, msg: 'Mohon Isikan Title'});
	let newKategori = new Kategori({
		title: title
	});

	m.generalCreateDoc(newKategori, (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, kategori: data});
	})
})
router.post('/kategori/hapus', (req, res) => {
	let id = req.body._id;

	if(!id) return res.json({success: false, msg: 'Mohon Isikan Kategori'});
	m.customeModelDeleteById(Kategori, id, (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, data});
	})
})
router.post('/kategori/edit', (req, res) => {
	let id = req.body._id,
			title = req.body.title;

	if(!id || !title) return res.json({success: false, msg: 'Mohon Isikan Data Kategori'});
	m.customeModelUpdateById(Kategori, id, {title: title}, { new: true, setDefaultsOnInsert: true }, (err, data) => {
		if(err) return res.status(500).send({ error : err });
		if(!data) return res.json({success: false, msg: 'Kategori tidak terdaftar'});
		return res.json({success: true, kategori: data})
	})
})

router.post('/kelas', (req, res) => {
	m.customeModelFindByQuery(Kelas, {}, (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, kelas: data})
	})
})
router.post('/kelas/tambah', (req, res) => {
	let title = req.body.title;

	if(!title) return res.json({success: false, msg: 'Mohon Isikan Title'});
	let newKelas = new Kelas({
		title: title
	});

	m.generalCreateDoc(newKelas, (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, kelas: data});
	})
})
router.post('/kelas/hapus', (req, res) => {
	let id = req.body._id;
	if(!id) return res.json({success: false, msg: 'Mohon Isikan kelas'});
	m.customeModelDeleteById(Kelas, id, (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, data});
	})
})
router.post('/kelas/edit', (req, res) => {
	let id = req.body._id,
			title = req.body.title;

	if(!id || !title) return res.json({success: false, msg: 'Mohon Isikan Data Kelas'});
	m.customeModelUpdateById(Kelas, id, {title: title}, { new: true, setDefaultsOnInsert: true }, (err, data) => {
		if(err) return res.status(500).send({ error : err });
		if(!data) return res.json({success: false, msg: 'Kelas tidak terdaftar'});
		return res.json({success: true, kelas: data})
	})
})

router.post('/rekening', (req, res) => {
	m.customeModelFindByQuery(Rekening, {}, (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, rekening: data})
	})
})
router.post('/rekening/tambah', (req, res) => {
	let namaBank = req.body.namaBank,
			noRek = req.body.noRek,
			atasNama = req.body.atasNama;

	if(!noRek || !atasNama) return res.json({success: false, msg: 'Mohon Isikan NoRek dan Atas Nama'});
	let newRekening = new Rekening({
		namaBank: namaBank,
		noRek: noRek,
		atasNama: atasNama
	});

	m.generalCreateDoc(newRekening, (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, rekening: data});
	})
})
router.post('/rekening/hapus', (req, res) => {
	let id = req.body._id;
	if(!id) return res.json({success: false, msg: 'Mohon Isikan Rekening'});
	m.customeModelDeleteById(Rekening, id, (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, data});
	})
})
router.post('/rekening/edit', (req, res) => {
	let id = req.body._id,
			namaBank = req.body.namaBank,
			noRek = req.body.noRek,
			atasNama = req.body.atasNama;

	if(!id) return res.json({success: false, msg: 'Mohon Isikan Data Rekening'});
	m.customeModelUpdateById(Rekening, id, {namaBank: namaBank, noRek: noRek, atasNama: atasNama}, { new: true, setDefaultsOnInsert: true }, (err, data) => {
		if(err) return res.status(500).send({ error : err });
		if(!data) return res.json({success: false, msg: 'Rekening tidak terdaftar'});
		return res.json({success: true, rekening: data})
	})
})

router.post('/siswa', (req, res) => {
	m.customeModelFindByQueryPopulate(Siswa, {}, ['kelas'], (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, siswa: data})
	})
})
router.post('/siswa/tambah', (req, res) => {
	let namaLengkap = req.body.namaLengkap,
			nisn = req.body.nisn,
			jenisKelamin = req.body.jenisKelamin,
			kelas = req.body.kelas;

	if(!namaLengkap || !nisn) return res.json({success: false, msg: 'Data Siswa Tidak Lengkap'});
	let newSiswa = new Siswa({
		namaLengkap: namaLengkap,
		nisn: nisn,
		jenisKelamin: jenisKelamin,
		kelas: kelas
	})

	m.generalCreateDoc(newSiswa, (err, data) => {
		if(err) return res.status(500).send({ error : err });

		m.customeModelFindByIdPopulate(Siswa, data._id, ['kelas'], (err, data) => {
			if(err) return res.status(500).send({ error : err });
			return res.json({success: true, siswa: data});
		})
	})
})
router.post('/siswa/hapus', (req, res) => {
	let id = req.body._id;
	if(!id) return res.json({success: false, msg: 'Mohon Isikan Data Siswa'});
	m.customeModelDeleteById(Siswa, id, (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, data});
	})
})
router.post('/siswa/edit', (req, res) => {
	let id = req.body._id,
			namaLengkap = req.body.namaLengkap,
			nisn = req.body.nisn,
			jenisKelamin = req.body.jenisKelamin,
			kelas = req.body.kelas;

	if(!id || !nisn) return res.json({success: false, msg: 'Mohon Lengkapi Data Siswa'});
	m.customeModelUpdateByIdPopulate(Siswa, id, {
		namaLengkap: namaLengkap,
		nisn: nisn,
		jenisKelamin: jenisKelamin,
		kelas: kelas
	}, { new: true, setDefaultsOnInsert: true }, ['kelas'], (err, data) => {
		if(err) return res.status(500).send({ error : err });
		if(!data) return res.json({success: false, msg: 'Siswa tidak terdaftar'});
		return res.json({success: true, siswa: data})
	})
})

router.post('/waliMurid', (req, res) => {
	m.customeModelFindByQuerySelectPopulateLean(User, {$or: [{isAdmin: false}, {isAdmin: undefined}]}, ['-isAdmin'], [{path: 'siswa', populate: 'kelas'}], (err, data) => {
		if(err) return res.status(500).send({ error : err });
		data.forEach(v => {
			v.hasPassword = v.password? true : false;
			delete v.password;
		})
		return res.json({success: true, waliMurid: data})
	})
})
router.post('/waliMurid/tambah', (req, res) => {
	let namaLengkap = req.body.namaLengkap,
			jenisKelamin = req.body.jenisKelamin,
			email = req.body.email,
			noTlp = req.body.noTlp,
			tglLahir = req.body.tglLahir,
			alamat = req.body.alamat,
			nik = req.body.nik,
			siswa = req.body.siswa,
			password = req.body.password;

	if(!namaLengkap || !email || !nik || jenisKelamin == null || jenisKelamin == undefined) return res.json({success: false, msg: 'Data Wali Murid Tidak Lengkap'});
	let newWaliMurid = new User({
		namaLengkap: namaLengkap,
		jenisKelamin: jenisKelamin,
		email: email,
		noTlp: noTlp,
		tglLahir: tglLahir,
		alamat: alamat,
		nik: nik,
		siswa: siswa
	})

	if(password){
		newWaliMurid.password = password;
		m.generatePassHash(newWaliMurid, (err, data) => {
			if(err) return res.status(500).send({ error : err });

			m.generalCreateDoc(data, (err, data) => {
				if(err) return res.status(500).send({ error : err });		

				m.customeModelUpdateManyByQuery(Siswa, {_id: {$in: siswa}}, {hasParent: true}, {}, (err, ssdata) => {
					if(err) return res.status(500).send({ error : err });

					m.customeModelFindByIdPopulate(User, data._id, [{path: 'siswa', populate: 'kelas'}], (err, data) => {
						if(err) return res.status(500).send({ error : err });
						if(!data) return res.json({success: false, msg: 'Wali Murid tidak terdaftar'});

						data = data.toJSON();
						delete data.__v;
						return res.json({success: true, waliMurid: data});
					})
				})
			})
		})
	}else{
		m.generalCreateDoc(newWaliMurid, (err, data) => {
			if(err) return res.status(500).send({ error : err });		

			m.customeModelUpdateManyByQuery(Siswa, {_id: {$in: siswa}}, {hasParent: true}, {}, (err, ssdata) => {
				if(err) return res.status(500).send({ error : err });

				m.customeModelFindByIdPopulate(User, data._id, [{path: 'siswa', populate: 'kelas'}], (err, data) => {
					if(err) return res.status(500).send({ error : err });
					if(!data) return res.json({success: false, msg: 'Wali Murid tidak terdaftar'});			

					data = data.toJSON();
					delete data.__v;
					return res.json({success: true, waliMurid: data});
				})
			})
		})
	}
})
router.post('/waliMurid/hapus', (req, res) => {
	let id = req.body._id;
	if(!id) return res.json({success: false, msg: 'Mohon Isikan Data Wali Murid'});
	m.customeModelDeleteById(User, id, (err, data) => {
		if(err) return res.status(500).send({ error : err });

		m.customeModelUpdateManyByQuery(Siswa, {_id: {$in: data.siswa}}, {hasParent: false}, {}, (err, sdata) => {
			if(err) return res.status(500).send({ error : err });
			return res.json({success: true, data: data});
		})

	})
})
router.post('/waliMurid/edit', (req, res) => {
	let id = req.body._id,
			namaLengkap = req.body.namaLengkap,
			jenisKelamin = req.body.jenisKelamin,
			email = req.body.email,
			noTlp = req.body.noTlp,
			tglLahir = req.body.tglLahir,
			alamat = req.body.alamat,
			nik = req.body.nik,
			siswa = req.body.siswa,
			password = req.body.password;

	if(!id || !namaLengkap || !email || !nik) return res.json({success: false, msg: 'Mohon Lengkapi Data Wali Murid'});
	let update = {
		namaLengkap: namaLengkap,
		jenisKelamin: jenisKelamin,
		email: email,
		noTlp: noTlp,
		tglLahir: tglLahir,
		alamat: alamat,
		nik: nik,
		siswa: siswa
	}
	
	if(password){
		update.password = password;
		m.customeModelFindById(User, id, (err, wdata) => {
			if(err) return res.status(500).send({ error : err });
			if(!wdata) return res.json({success: false, msg: 'Wali Murid tidak terdaftar'});

			m.customeModelUpdateManyByQuery(Siswa, {_id: {$in: wdata.siswa}}, {hasParent: false}, {}, (err, sdata) => {
				if(err) return res.status(500).send({ error : err });

				m.generatePassHash(update, (err, data) => {
					if(err) return res.status(500).send({ error : err });

					m.customeModelUpdateById(User, id, data, { new: true, setDefaultsOnInsert: true }, (err, data) => {
						if(err) return res.status(500).send({ error : err });
						if(!data) return res.json({success: false, msg: 'Wali Murid tidak terdaftar'});

						m.customeModelUpdateManyByQuery(Siswa, {_id: {$in: siswa}}, {hasParent: true}, {}, (err, ssdata) => {
							if(err) return res.status(500).send({ error : err });

							m.customeModelFindByIdPopulate(User, id, [{path: 'siswa', populate: 'kelas'}], (err, data) => {
								if(err) return res.status(500).send({ error : err });
								if(!data) return res.json({success: false, msg: 'Wali Murid tidak terdaftar'});

								data = data.toJSON();
								data.hasPassword = data.password? true : false;
								delete data.password;
								delete data.__v;
								return res.json({success: true, waliMurid: data, siswa: siswa})
							})
						})
						
					})
				})
			})
		})
	}else{
		m.customeModelFindById(User, id, (err, wdata) => {
			if(err) return res.status(500).send({ error : err });
			if(!wdata) return res.json({success: false, msg: 'Wali Murid tidak terdaftar'});

			m.customeModelUpdateManyByQuery(Siswa, {_id: {$in: wdata.siswa}}, {hasParent: false}, {}, (err, sdata) => {
				if(err) return res.status(500).send({ error : err });
			
				m.customeModelUpdateById(User, id, update, { new: true, setDefaultsOnInsert: true }, (err, data) => {
					if(err) return res.status(500).send({ error : err });
					if(!data) return res.json({success: false, msg: 'Wali Murid tidak terdaftar'});

					m.customeModelUpdateManyByQuery(Siswa, {_id: {$in: siswa}}, {hasParent: true}, {}, (err, ssdata) => {
						if(err) return res.status(500).send({ error : err });
						
						m.customeModelFindByIdPopulate(User, id, [{path: 'siswa', populate: 'kelas'}], (err, data) => {
							if(err) return res.status(500).send({ error : err });
							if(!data) return res.json({success: false, msg: 'Wali Murid tidak terdaftar'});

							data = data.toJSON();
							data.hasPassword = data.password? true : false;
							delete data.password;
							delete data.__v;
							return res.json({success: true, waliMurid: data})
						})
					})
				})
			})
		})
	}
})

router.post('/tagihan', (req, res) => {
	m.customeModelFindByQueryPopulate(Tagihan, {$or: [{delete: false}, {delete: undefined}]}, ['kelas', 'kategori'], (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, tagihan: data})
	})
})
router.post('/tagihan/tambah', (req, res) => {
	let title = req.body.title,
			deskripsi = req.body.deskripsi,
			nominal = req.body.nominal,
			waktuMulai = req.body.waktuMulai,
			waktuAkhir = req.body.waktuAkhir,
			kategori = req.body.kategori,
			kelas = req.body.kelas;

	if(!title || !nominal || !waktuMulai || !kelas) return res.json({success: false, msg: 'Data Tagihan Tidak Lengkap'});
	let newTagihan = new Tagihan({
		title: title,
		deskripsi: deskripsi,
		nominal: nominal,
		waktuMulai: waktuMulai,
		waktuAkhir: waktuAkhir,
		kategori: kategori,
		kelas: kelas
	});

	m.generalCreateDoc(newTagihan, (err, data) => {
		if(err) return res.status(500).send({ error : err });

		m.customeModelFindByIdPopulate(Tagihan, data._id, ['kelas', 'kategori'], (err, data) => {
			if(err) return res.status(500).send({ error : err });
			return res.json({success: true, tagihan: data});
		})
	})
})
router.post('/tagihan/hapus', (req, res) => {
	let id = req.body._id;
	if(!id) return res.json({success: false, msg: 'Mohon Isikan Data Tagihan'});
	m.customeModelUpdateById(Tagihan, id, {delete: true}, { new: true, setDefaultsOnInsert: true }, (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, data});
	})
})
router.post('/tagihan/edit', (req, res) => {
	let id = req.body._id,
			title = req.body.title,
			deskripsi = req.body.deskripsi,
			nominal = req.body.nominal,
			waktuMulai = req.body.waktuMulai,
			waktuAkhir = req.body.waktuAkhir,
			kategori = req.body.kategori,
			kelas = req.body.kelas;

	if(!id || !title || !nominal || !waktuMulai || !kategori || !kelas) return res.json({success: false, msg: 'Mohon Lengkapi Data Tagihan'});
	m.customeModelUpdateByIdPopulate(Tagihan, id, {
		title: title,
		deskripsi: deskripsi,
		nominal: nominal,
		waktuMulai: waktuMulai,
		waktuAkhir: waktuAkhir,
		kategori: kategori,
		kelas: kelas
	}, { new: true, setDefaultsOnInsert: true }, ['kelas', 'kategori'], (err, data) => {
		if(err) return res.status(500).send({ error : err });
		if(!data) return res.json({success: false, msg: 'Tagihan tidak terdaftar'});
		return res.json({success: true, tagihan: data})
	})
})
router.post('/tagihan/penerima/belumLunas', (req, res) => {
	let id = req.body._id;

	m.customeModelAggregate(Tagihan, [{
		$match: {
			_id: ObjectId(id)
		}
	}, {
		$lookup: {
			from: 'pembayarans',
			pipeline: [{
				$match: { 'tagihan._id': ObjectId(id), status: 2 }
			}],
			as: 'lunas'
		}
	}, {
		$addFields: {
			lunas: {
				$reduce: {
					input: '$lunas',
					initialValue: [],
					'in': { $concatArrays: ['$$value', '$$this.tagihan'] }
				}
			}
		}
	}, {
		$lookup: {
			from: 'siswas',
			'let': {
				kelas: '$kelas',
				lunas: '$lunas'
			},
			pipeline: [{
				$match: {
					$expr: {
						$and: [{
							$in: [ '$kelas', '$$kelas' ]
						}, {
							$not: [{ $in: [ '$_id', '$$lunas.siswa' ] }]
						}]
					}
				}
			}],
			as: 'siswa'
		}
	}, {
		$project: {
			siswa: '$siswa',
			_id: false
		}
	}, {
		$unwind: '$siswa'
	}, {
		$lookup: {
			from: 'kelas',
			localField: 'siswa.kelas',
			foreignField: '_id',
			as: 'siswa.kelas'
		}
	}, {
		$lookup: {
			from: 'users',
			localField: 'siswa._id',
			foreignField: 'siswa',
			as: 'ortu'
		}
	}, {
		$addFields: {
			ortu: {
				$arrayElemAt: [ '$ortu', 0 ]
			},
			'siswa.kelas': {
				$arrayElemAt: [ '$siswa.kelas', 0 ]
			}
		}
	}, {
		$group: {
			_id: '$ortu',
			siswa: {
				$push: '$siswa'
			}
		}
	}, {
		$addFields: {
			'_id.siswa': '$siswa'
		}
	}, {
		$replaceRoot: {
			newRoot: '$_id'
		}
	}], (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, penerima: data});
	})

	// if(!id) return res.json({success: false, msg: 'Data Tagihan Tidak Lengkap'});
	// m.customeModelFindById(Tagihan, id, (err, data) => {
	// 	if(err) return res.status(500).send({ error : err });
	// 	if(!data) return res.json({success: false, msg: 'Tagihan tidak terdaftar'});

	// 	m.customeModelFindByQuery(Siswa, {kelas: { $in: data.kelas}}, (err, data) => {
	// 		if(err) return res.status(500).send({ error : err });
			
	// 		return res.json({success: false, penerima: data});

	// 		m.customeModelFindByQueryPopulate(User, {siswa: { $in: data.map(v => v._id)}}, [{path: 'siswa', populate: 'kelas'}], (err, data) => {
	// 			if(err) return res.status(500).send({ error : err });
				
	// 			return res.json({success: true, penerima: data});
	// 		})
	// 	})

	// })
})
router.post('/tagihan/penerima/lunas', (req, res) => {
	let id = req.body._id;
	m.customeModelAggregate(Pembayaran, [{
		$match: {
			'tagihan._id': ObjectId(id),
			'status': 2
		}
	}, {
		$unwind: '$tagihan'
	}, {
		$addFields: {
			'tagihan.siswaBackup.kelas': '$tagihan.kelasBackup'
		}
	}, {
		$lookup: {
			from: 'users',
			localField: 'user',
			foreignField: '_id',
			as: 'user'
		}
	}, {
		$addFields: {
			user: {
				$arrayElemAt: ['$user', 0]
			}
		}
	}, {
		$group: {
			_id: '$user',
			siswa: {
				$push: '$tagihan.siswaBackup'
			}
		}
	}, {
		$addFields: {
			'_id.siswa': '$siswa'
		}
	}, {
		$replaceRoot: {
			newRoot: '$_id'
		}
	}], (err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, penerima: data});
	})
})

router.post('/pembayaran', (req, res) => {
	let status = req.body.status;

	m.customeModelFindByQueryPopulate(
		Pembayaran, { status: {$in: status }}, ['tagihan.kelas', 'tagihan.kategori'], (err, data) => {
		if(err) return res.status(500).send({ error : err });
		setTimeout(_ => {
			return res.json({success: true, pembayaran: data})
		}, 2000)
	})
})
router.post('/pembayaran/bukti/verifikasi', (req, res) => {
	let idPembayaran = req.body.idPembayaran,
			statusBukti = req.body.statusBukti,
			idBukti = req.body.idBukti;

	m.customeModelUpdateByQuery(
		Pembayaran, 
		{ _id: idPembayaran, 'buktiPembayaran._id': idBukti}, 
		{ status: statusBukti == 1? 2 : 3, waktuPelunasan: statusBukti == 1? Date.now() : undefined, $set: {'buktiPembayaran.$.verify': statusBukti}}, 
		{new: true},
		(err, data) => {
		if(err) return res.status(500).send({ error : err });
		return res.json({success: true, pembayaran: data})
	})
})

module.exports = router;