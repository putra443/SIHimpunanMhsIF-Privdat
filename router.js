import express, { query } from 'express';
import mysql from 'mysql';
import { flash } from 'express-flash-message';
import pdf from 'html-pdf';
import ejs from 'ejs';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
var route = express.Router();
const __filename = fileURLToPath(import.meta.url);

// query

const getTopik = conn => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM topik JOIN dosen ON topik.noDosen = dosen.noDosen'    , (err, result)=> {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};

const getTopikFilter = (conn,getName) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM topik JOIN dosen ON topik.noDosen = dosen.noDosen WHERE dosen.namaD LIKE '%${getName}%' ` , (err, result)=> {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};

const getKomen = (conn, idTopik) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT dosen.namaD AS namadosen, review.komentar AS komendosen, review.idTopik FROM review JOIN topik ON review.idTopik = topik.idTopik JOIN dosen ON topik.noDosen = dosen.noDosen WHERE review.idTopik ='${idTopik}'`, (err, result)=> {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
}

const getNamaD = (conn,idTopik) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT * FROM dosen JOIN review ON dosen.noDosen = review.noDosen`, (err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};

const getUsers = conn => {
    return new Promise((resolve,reject) => {
        conn.query('SELECT * FROM dosen', (err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};

const checkLogin = (conn, npm, password) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT npm, pwd FROM users WHERE npm LIKE '%${npm}%' AND pwd LIKE '%${password}%'`, (err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};

const getNameF = (conn,getName) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT * FROM dosen WHERE namad LIKE '%${getName}%' `,(err,result) => {
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

const getNoDosen = (conn,getName) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT noDosen FROM dosen WHERE namad LIKE '%${getName}%' `,(err,result) => {
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}
const getStatuSS = (conn,getStatus) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT statusSkripsi FROM topik WHERE statusSkripsi LIKE '%${getStatus}%' `,(err,result) => {
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}
const getThn = (conn,getTahun) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT tahunAjaran FROM topik WHERE tahunAjaran LIKE '%${getTahun}%' `,(err,result) => {
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}


//query kelola akun

const getUsername = (conn,akunDiganti) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT * FROM dosen WHERE username LIKE '%${akunDiganti}%' `,(err,result) => {
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

//query untuk mengubah nama dosen
const updateNama = (conn,namaDiganti,results) => {
    return new Promise((resolve,reject) => {
        conn.query(`UPDATE Dosen SET namaD = '${namaDiganti}' WHERE namaD LIKE '%${results[0].namaD}%'`,(err,result) =>{
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

//query untuk mengubah password
const updatePassword = (conn,passwordDiganti,results) => {
    return new Promise((resolve,reject) => {
        conn.query(`UPDATE Dosen SET pwd = '${passwordDiganti}' WHERE pwd = '${results[0].pwd}'`,(err,result) =>{
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

//query untuk mengubah nomor dosen
const updateNoDosen = (conn,noDosenDiganti,results) => {
    return new Promise((resolve,reject) => {
        conn.query(`UPDATE Dosen SET noDosen = '${noDosenDiganti}' WHERE noDosen = '${results[0].noDosen}'`,(err,result) =>{
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

//query untuk mengubah username
const updateUsername = (conn,usernameDiganti,results) => {
    return new Promise((resolve,reject) => {
        conn.query(`UPDATE Dosen SET username = '${usernameDiganti}' WHERE username LIKE '%${results[0].username}%'`,(err,result) =>{
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

//query untuk memasukan akun baru ke database
const addAkun = (conn,nama,username,password,noDosen,roles) => {
    return new Promise((resolve,reject) => {
        conn.query(`INSERT INTO dosen (namaD,noDosen,username,pwd,roles) VALUES ('${nama}','${noDosen}','${username}','${password}','${roles}')`,(err,result) => {
            if(err){
                reject(err)
            }
            else{
                resolve(result);
            }
        })
    })
}

//query untuk mendapatkan data-data user dosen yang terdaftar
const getUsersPage = conn => {
    return new Promise((resolve,reject) =>{
        conn.query('SELECT * FROM dosen',(err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}

const getUsersPage2 = (conn,startLimit,resultsPage) => {
    return new Promise((resolve,reject) =>{
        conn.query(`SELECT * FROM dosen LIMIT ${startLimit},${resultsPage}`,(err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
              }
        });
    });
};  

//query untuk mendapatkan nilai terbesar dari idtopik di tabel topik
const getMax = conn => {
    return new Promise((resolve, rejects) =>{
        conn.query('SELECT MAX(idTopik) as max FROM topik',(err, result) =>{
            if(err){
                rejects(err);
            }else{
                resolve(result);
            }
        });
    });
};

//query untuk mendapatkan nilai terbesar dari reviewid di tabel review
const getMaxRev = conn => {
    return new Promise((resolve, rejects) =>{
        conn.query('SELECT MAX(reviewID) as max FROM review',(err, result) =>{
            if(err){
                rejects(err);
            }else{
                resolve(result);
            }
        });
    });
};

//query untuk menambahkan topik
const tambahTopik = (conn,idx, judul, bidang, tipeS, noID, periode) => {
    return new Promise((resolve,reject) => {
        conn.query(`INSERT INTO topik (idTopik, judulTopik, peminatan, tipe, noDosen, tahunAjaran, statusSkripsi) VALUES (${idx},'${judul}', '${bidang}','${tipeS}', '${noID}', '${periode}', "NULL") `,(err,result) => {
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

//query untuk menampilkan topik milik dosen untuk di halaman skripsiSaya
const topikDosen = (conn,noID) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT idTopik, judulTopik, peminatan, tipe, statusSkripsi FROM topik WHERE noDosen LIKE '%${noID}%' `,(err,result) => {
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}


// Connect Database

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbprivdat'
});

const dbConnect = () => {
    return new Promise((resolve,reject) => {
        pool.getConnection((err,conn) => {
            if(err){
                reject(err);
            }
            else{
                resolve(conn);
                
            }
        })
    })
}


// ambil koneksi Dosen

route.get('/home', async(req,res) => {
    const conn = await dbConnect();
    conn.release();
    var nama = req.session.name;
    var noID = req.session.noID;
    var idRole = req.session.role;
    if(req.session.loggedin){
        if(idRole == 3){
            res.render('home', {
                nama, noID, idRole
            });
        }
        else{
            res.redirect('/homeAdmin')
        }
    } else {
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
});


// Get buat search filter DaftarTopikDosen
route.get('/daftarTopikDosen',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    let results = await getTopik(conn);
    let comments = await getKomen(conn);
    const idTopik = req.body.aTopik
    let namaKomen = await getNamaD(conn,idTopik)
    const getName = req.query.filter;
    const nama = req.session.name;
    if(getName != undefined && getName.length){
        results = await getTopikFilter(conn,getName);
        if(req.session.loggedin){
            if(req.session.role == "Dosen"){
                res.render('daftarTopikDosen',{
                    results,comments, nama, idTopik, namaKomen
                })
            }
            else{
                res.redirect('/daftarTopik')
            }
        }
        else{
            req.flash('message','anda harus login terlebih dahulu')
            res.redirect('/');
        }
     }
    else if(req.session.loggedin){
        if(req.session.role == "Dosen"){
            res.render('daftarTopikDosen',{
                results,comments, nama, idTopik, namaKomen
            })
        }
        else{
            res.redirect('/daftarTopik')
        }
    }else{
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
    conn.release();
    console.log(results)
    });

    route.post('/daftarTopikDosen2',express.urlencoded(), async(req,res) => {
        const conn = await dbConnect();
        const komen = req.body.komentar;
        const idTopik = req.body.kTopik;
        const noID = req.session.noID;
        var maxID = await getMaxRev(conn); //Buat dapetin IdTopik terbesar di DB
        var idx = maxID[0].max+1;
        var sql = `INSERT INTO review (reviewID, noDosen, idTopik, komentar) VALUES ('${idx}','${noID}','${idTopik}','${komen}') `    
        conn.query(sql, [idx, idTopik, komen], (err)=>{
            if(err) throw err;
            res.redirect('/daftarTopikDosen')
            res.end();
        })
        conn.release();
    });
    

// ambil koneksi Admin

route.get('/homeAdmin',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    conn.release();
    var nama = req.session.name;
    var noID = req.session.noID;
    var roleD = req.session.role;
    if(req.session.loggedin){
        if(roleD == "Admin"){
            res.render('homeAdmin', {
                nama, noID, roleD, periode
            });
        }
        else{
            res.send('Anda tidak memiliki akses')
        }
    } else {
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
});

route.post('/homeAdmin',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    const periode = req.body.setPeriode;
    var sql = `SELECT namaPeriode FROM semester WHERE periode ='${periode}'`;
    conn.query(sql, [periode], (err,result)=>{
        if(err) throw err;
        res.redirect('/homeAdmin')
    })
    console.log(periode)
});

route.get('/', async(req,res) => {
    const conn = await dbConnect();
    const message = req.flash('message')
    conn.release();
    res.render('login', { message})
    });
    
//File Upload
    const fileStorageEngine  = multer.diskStorage({
        destination: ( req, file, cb)=>{
            cb(null,"./uploadedFile");
            },
        filename: (req, file, cb)=>{
            cb(null,Date.now()+'--'+ file.originalname);
           },
    });
        
    const upload = multer({storage: fileStorageEngine});
    
    route.get('/unggahTopik',express.urlencoded(), async(req,res) => {
        const conn = await dbConnect();
        const message = req.flash('message')
        conn.release();
        if(req.session.loggedin){
            res.render('unggahTopik', { message
            });
        }
         else {
            res.redirect('/')
        }
    });
    
    route.post('/unggahTopik',express.urlencoded(), upload.single("fileTopik"), async(req,res) => {
        const noID = req.session.noID; //Buat dapetin noDosen
        const judul = req.body.judulT;
        const bidang = req.body.peminatan;
        const tipeT = req.body.tipeSkripsi;
        const periode = req.body.periode;
        const conn = await dbConnect();
        var maxID = await getMax(conn); //Buat dapetin IdTopik terbesar di DB
        var idx = maxID[0].max+1;
    
        if(req.session.loggedin){
            res.render('unggahTopik', {
                noID, idx, judul, bidang, tipeT,periode
            });
        }
        else{
            req.flash('message', 'Anda harus login terlebih dahulu');
            res.redirect('/')
        }
        if(judul.length > 0 && bidang.length > 0 && tipeT.length > 0 && periode.length>0 ){
            await tambahTopik(conn,idx, judul, bidang, tipeT, noID,periode);
            res.sendFile('unggahTopik.ejs', {root: "./views"})
        }
        
        conn.release();
    });

//mengambil koneksi untuk skripsiSaya
route.get('/skripsiSaya', async(req,res) => {
    const noID = req.session.noID;
    const conn = await dbConnect();
    let results = await topikDosen(conn, noID);
    conn.release();
    if(req.session.loggedin){
        res.render('topikSkripsiSaya', {
            results
        });
    }else{
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
});

route.post('/skripsiSaya',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    const ubahStat = req.body.gantiStat;
    const idTopik = req.body.noTopik
    var sql = `UPDATE topik SET statusSkripsi = '${ubahStat}' WHERE idTopik ='${idTopik}'`
    if(ubahStat == "OPEN" ||ubahStat == "CLOSE"||ubahStat == "TAKEN"){
        conn.query(sql, [ubahStat,idTopik], ()=>{
            res.redirect('/skripsiSaya')
            res.end();
        })
    }
        else{
            res.send('Data error')
        }
    conn.release();
});

//mengambil koneksi untuk daftartopik + filter nama
route.get('/daftarTopik',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    let results = await getTopik(conn);
    let comments = await getKomen(conn);
    let namaKomen = await getNamaD(conn)
    const getName = req.query.filter;
    const nama = req.session.name;
    const idTopik = req.body.kTopik
    if(getName != undefined && getName.length){
        results = await getTopikFilter(conn,getName);
        if(req.session.loggedin){
            if(req.session.role == "Admin"){
                res.render('daftarTopik',{
                    results,comments, nama, idTopik, namaKomen
                })
            }else{
                res.send('Anda tidak memiliki akses')
            }
        }
        else{
            req.flash('message','anda harus login terlebih dahulu')
            res.redirect('/');
        }
        console.log(results)
     }
    else if(req.session.loggedin){
        if(req.session.role == "Admin"){
            res.render('daftarTopik',{
                results,comments, nama, idTopik, namaKomen
            })
        }else{
            res.send('Anda tidak memiliki akses')
        }
    }else{
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
    conn.release();
    });

// getLaporanDaftarTopik
route.get('/laporanDaftarTopik',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    let results = await getTopik(conn);
    let comments = await getKomen(conn);
    let namaKomen = await getNamaD(conn)
    const getName = req.query.filter;
    const getStatus = req.query.filterStat;
    const getTahun = req.query.filterTahun;
    const nama = req.session.name;
    const idTopik = req.body.kTopik
    if(getName != undefined && getName.length > 0 && getStatus != undefined && getStatus.length > 0 && getTahun != undefined && getTahun.length > 0){
        let noDosen = await getNoDosen(conn,getName);
        var stat = await getStatuSS(conn,getStatus);
        var thnAjaran = await getThn(conn,getTahun);
        let noDosenData = noDosen[0].noDosen;
        var inputStatus = stat[0].statusSkripsi;
        var inputTahun = thnAjaran[0].tahunAjaran;
        results = await getTopikFilter(conn,noDosenData, inputTahun, inputStatus);
        if(req.session.loggedin){
            if(req.session.role=="Admin"){
                res.render('daftarTopik',{
                    results,comments, nama, idTopik, namaKomen
                })
            }
            else{
                res.send('Anda tidak memiliki akses')
            }
        }
        else{
            req.flash('message','anda harus login terlebih dahulu')
            res.redirect('/');
        }
        console.log(noDosenData)
     }
    else if(req.session.loggedin){
        if(req.session.role=="Admin"){
            res.render('laporanDaftarTopik',{
                results,comments, nama, idTopik, namaKomen
            })
        }
        else{
            res.send('Anda tidak memiliki akses')
        }
    }else{
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
    conn.release();
    });

route.get('/daftarTopik2',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    let results = await getTopik(conn);
    let comments = await getKomen(conn);
    let namaKomen = await getNamaD(conn)
    const nama = req.session.name;
    const idTopik = req.body.plisTopik
    if(req.session.loggedin){
        if(req.session.role=="Admin"){
            res.render('daftarTopik',{
                results,comments, nama, idTopik, namaKomen
            })
        }
        else{
            res.send('Anda tidak memiliki akses')
        }
    }else{
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
    conn.release();
});

//get delete topik
route.get('/daftarTopik3',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    let results = await getTopik(conn);
    let comments = await getKomen(conn);
    let namaKomen = await getNamaD(conn)
    const nama = req.session.name;
    const idTopik = req.body.kTopik
    if(req.session.loggedin){
        if(req.session.role=="Admin"){
            res.render('daftarTopik',{
                results,comments, nama, idTopik, namaKomen
            })
        }
        else{
            res.send('Anda tidak memiliki akses')
        }
    }else{
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
    conn.release();
});

//mengubah status skripsi
route.post('/daftarTopik',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    const ubahStat = req.body.gantiStat;
    const idTopik = req.body.noTopik;
    var sql = `UPDATE topik SET statusSkripsi = '${ubahStat}' WHERE idTopik ='${idTopik}'`
    if(ubahStat == "OK"|| ubahStat == "NO" || ubahStat == "INQ"){
        conn.query(sql, [ubahStat,idTopik], ()=>{
            res.redirect('/daftarTopik')
            res.end();
        })
    }
    else{
        res.send('Data Error')
    }
});

//delete topik
route.post('/daftarTopik3',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    const idTopik = req.body.noTopik;
    var sql = `DELETE FROM topik WHERE idTopik ='${idTopik}'`
    conn.query(sql, [idTopik], ()=>{
        res.redirect('/daftarTopik')
        res.end();
    })
});

//menambahkan komentar
route.post('/daftarTopik2',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    const komen = req.body.komentar;
    const idTopik = req.body.kTopik;
    const noID = req.session.noID;
    var maxID = await getMaxRev(conn); //Buat dapetin IdTopik terbesar di DB
    var idx = maxID[0].max+1;
    var sql = `INSERT INTO review (reviewID, noDosen, idTopik, komentar) VALUES ('${idx}','${noID}','${idTopik}','${komen}') `    
    conn.query(sql, [idx, idTopik, komen], (err)=>{
        if(err) throw err;
        res.redirect('/daftarTopik')
        res.end();
    })
    conn.release();
});

//Generate Report PDF
route.post('/daftarTopikExportToPDF',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    let results = await getTopik(conn);
    let options = {
        "height": "11.25in",
        "width": "8.5in",
        "header": {
            "height": "20mm"
        },
        "footer": {
            "height": "20mm",
        },
    };
    res.render('laporanDaftarTopik',{results},function(err,html){
        pdf.create(html,options).toFile('./views/laporan/LaporanTopikSkripsi.pdf',function(err,result) {
            if(err){console.log(err)}
            else{
                console.log('file created');
                res.redirect('/daftarTopik');
            }
        });
    })
    conn.release();
    });

//kelola akun
route.get('/kelolaAkun',express.urlencoded(), async(req,res) => {
    if(req.session.role=="Admin"){
        const getName = req.query.filter;
    const conn = await dbConnect();
    let results = await getUsersPage(conn);
    const numResults = results.length;
    let resultsPage = 3;
    const numPages = Math.ceil(numResults/resultsPage);
    let page = req.query.page ? Number(req.query.page) : 1;
    if(page > numPages){
        res.redirect('/kelolaAkun?page=' +encodeURIComponent(numPages));
    } else if (page<1){
        res.redirect('/kelolaAkun?page=' +encodeURIComponent('1'));
    }
    let startLimit = (page-1) * resultsPage;

    results = await getUsersPage2(conn,startLimit,resultsPage);
        let iteration = (page-3) < 1 ? 1 : page-2;
        let ending = (iteration+7) <= numPages ? (iteration+7) : page + (numPages-page);
        if(ending < (page+1)){
            iteration -= (page+1) - numPages;
        }
        if(req.session.loggedin){
            if(req.session.role="Admin"){
                res.render('kelolaAkun',{
                    results : results,page,iteration,ending,numPages
                })
            }else{
                res.send('Anda tidak memiliki akses')
            }
        }
        else{
            req.flash('message','anda harus login terlebih dahuluu')
            res.redirect('/');
        }
    //search filter
    if(getName != undefined && getName.length > 0){
        results = await getNameF(conn,getName);
        if(req.session.loggedin){
            if(req.session.role =="Admin"){
                res.render('kelolaAkun',{
                    results : results,page,iteration,ending,numPages
                })
            }
            else{
                res.send('Anda tidak memiliki akses')
            }
        }
        else{
            req.flash('message','anda harus login terlebih dahulu')
            res.redirect('/');
        }
        conn.release();
    }
    }else{
        res.send('Anda tidak memiliki akses')
    }
        });

route.post('/kelolaAkun',express.urlencoded(),async(req,res)=>{
    const conn = await dbConnect();
    if(req.session.loggedin){
        if(req.session.role=="Admin"){
            res.redirect('kelolaAkunLanjutan');
        }
        else{
            res.send('Anda tidak memiliki akses')
        }
    }
    else{
        req.flash('message','anda harus login terlebih dahulu')
        res.redirect('/');
    }

});

route.get('/kelolaAkunLanjutan',express.urlencoded(), async(req,res) =>{
    const conn = await dbConnect();
    conn.release();
    if(req.session.loggedin){
        if(req.session.role=="Admin"){
            res.render('kelolaAkunLanjutan');
        }
        else{
            res.send('Anda tidak memiliki akses')
        }
    }
    else{
        req.flash('message','anda harus login terlebih dahulu')
        res.redirect('/');
    }
});

route.post('/kelolaAkunLanjutan',express.urlencoded(), async(req,res) =>{
    const conn = await dbConnect();
    let akunDiganti = req.body.akunGanti;
    let results = await getUsername(conn,akunDiganti);
    const namaDiganti = req.body.gantiNama
    const usernameDiganti = req.body.gantiUsername;
    const passwordDiganti = req.body.gantiPassword;
    const noDosenDiganti = req.body.gantiNoDosen;
    if(namaDiganti.length > 0){
        await updateNama(conn,namaDiganti,results);
    }
    if(passwordDiganti.length > 0){
        await updatePassword(conn,passwordDiganti,results);
    }
    if(noDosenDiganti.length > 0){
        await updateNoDosen(conn,noDosenDiganti,results);
    }
    if(usernameDiganti.length > 0){
        await updateUsername(conn,usernameDiganti,results);
    }
    conn.release();
    res.redirect('kelolaAkun');
})

//Post add user Page
route.post('/addUserPage',async(req,res) =>{
    if(req.session.loggedin){
        if(req.session.role =="Admin"){
            const conn = await dbConnect();
        res.redirect('/addUser');
        conn.release();
        }
        else{
            res.send('Anda tidak memiliki akses')
        }
    }
    else{
        req.flash('message','anda harus login terlebih dahulu')
        res.redirect('/');
    }
})

//Get Add User Page

route.get('/addUser',express.urlencoded(),async(req,res) => {
    if(req.session.loggedin){
        if(req.session.role=="Admin"){
            const conn = await dbConnect();
        res.render('addUser');
        conn.release();
        }
        else{
            res.send('Anda tidak memiliki akses')
        }
    }
    else{
        req.flash('message','anda harus login terlebih dahulu')
        res.redirect('/');
    }
})

//memanggil koneksi addAkun
route.post('/addAkun',express.urlencoded(),async(req,res) => {

    if(req.session.loggedin){
        if(req.session.role=="Admin"){
        const conn = await dbConnect();
        const nama = req.body.gantiNama
        const username = req.body.gantiUsername;
        const password = req.body.gantiPassword;
        const noDosen = req.body.gantiNoDosen;
        const roles = req.body.Roles;
        console.log(nama)
        if(nama.length > 0 && username.length > 0 && password.length > 0 && noDosen.length > 0 && roles.length > 0){
            if(roles =="Admin" || roles == "Dosen"){
                await addAkun(conn,nama,username,password,noDosen,roles)
                res.redirect('/kelolaAkun')
            }
            else{
                res.send('error')
            }
        }
        conn.release();
        }else{
            res.send('Anda tidak memilki akses')
        }
    }
    else{
        req.flash('message','anda harus login terlebih dahulu')
        res.redirect('/');
    }
})

//halaman log-in
route.post('/',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    const cekUser = checkLogin(conn,npm,password)
    var npm = req.body.user;
    var password = req.body.pass;
    var sql = `SELECT * FROM users WHERE npm ='${npm}' AND pwd ='${password}'`;
    conn.query(sql, [npm,password], (err, results)=>{
        if(err) throw err;
        if(results.length > 0){
            req.session.loggedin = true;
            req.session.username = npm;
            req.session.name = results[0].nama;
            req.session.noID = results[0].npm;
            req.session.role = results[0].idRole;
            if(results[0].roles == "Admin"){
                res.redirect('/homeAdmin')
            }
            else if(results[0].idRole == 3){
                res.redirect('/home')
            }
        }
        else if(npm = "" || password == ""){
            req.flash('message', 'Username atau Password Tidak Boleh Kosong!');
            res.redirect('/')
        }
        else{
            req.flash('message', 'Username atau Password Anda salah!');
            res.redirect('/')
        }
        console.log(npm,password)
        res.end();
    })
    
})

export {route};

// DropDown Status DaftarSkirpsi