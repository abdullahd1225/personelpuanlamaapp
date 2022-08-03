const fastify = require("fastify")
const mongodb = require("mongodb")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {reset} = require("nodemon/lib/rules");
let jwt_secret_key = "very very secret key"

let main = async() => {
    try {
        console.log("starting")

        const db_client = new mongodb.MongoClient("mongodb://localhost:27017")

        const app = fastify()

        await db_client.connect()
        let db = db_client.db("tsoft_personel")
        let user_db = db.collection("user")
        let personal_db = db.collection("personal")





        let admin = await user_db.findOne({_id: "admin"})
        if(admin == null) {
            console.log("creating admin")
            await user_db.insertOne({
                _id: "admin",
                username: "admin",
                name: "Admin",
                password: await bcrypt.hash("1234", 10)
            })
        }else {
            console.log("admin exists")
        }

        app.post("/login", async(req, res) => {
            let user = await user_db.findOne({username: req.body.username});

            if(user == null) {
                res.statusCode = 401
                return {error: "Invalid credentials"}
            }

            if(await bcrypt.compare(req.body.password, user.password)){
                let token = jwt.sign(user._id, "jwt_secret_key")

                return token
            }
            else {
                res.statusCode = 401
                return {error: "Invalid credentials"}

            }
        })



        app.post("personal",async (req,res ) => {
            await personal_db.insertOne({
                name :      req.body.name,
                phone:      req.body.phone,
                title:      req.body.title,
                department: req.body.department,

            })

        })

        app.post("gosterge" , async (req,res) =>{
            await personal_db.insertOne({
                takimcalismasi:   req.body.takimcalismasi,
                musteriodaklilik: req.body.musteriodaklilik,
                iletisim:         req.body.iletisim,
                gelisim:          req.body.gelisim,
                disiplin:         req.body.disiplin,
                verimlilik:       req.body.verimlilik,

            })
        })
        app.post("takimcalismasi",async (req,res)=>{
            await personal_db.insertOne({
                ekipcalismasi: req.body.takimcalismasi.ekipcalismasi,
                isarkadas:     req.body.takimcalismasi.isarkadas,
                digerbolumler: req.body.takimcalismasi.digerbolumler,
                aidiyet:       req.body.takimcalismasi.aidiyet,
                sorumluluk:    req.body.takimcalismasi.sorumluluk,


            })
        })
        app.post("musteriodaklilik",async (req,res)=>{
            await personal_db.insertOne({
                musteriodaklilik: req.body.musteriodaklilik.musteri_satis,

            })
        })

        app.post("iletisim",async (req,res) => {
            await personal_db.insertOne({
                dinlenme:     req.body.dinlenme,
                pozitifolma:  req.body.pozitifolma,
                geribildirim: req.body.geribildirim,

            })
        })

        app.post("gelisim" ,async (req,res)=>{
            await personal_db.insertOne({
                ogrenmeyeacikolma: req.body.ogrenmeyeacikolma,
                proaktifyaklasim:  req.body.proaktifyaklasim,
                cozumodakli:       req.body.cozumodakli,


            })
        })

        app.post("disiplin" , async (req,res)=>{
            await  personal_db.insertOne({

                stresyonetimi: req.body.stresyonetimi,
                planlicalisma: req.body.planlicalisma,
                sonucodakli:   req.body.sonucodakli,
                isyerikurali:  req.body.isyerikurali,

            })
        })

        app.post("verimlilik", async (req,res)=>{
            await personal_db.insertOne({
                jetofis: req.body.jetofis,
                makale:  req.body.makale,
                crmper:  req.body.crmper,
            })
        })

        app.post("toplampuan",async (req,res)=>{
            await personal_db.insertOne({
                toplampuan: req.body.toplampuan,
                sayi1 : req.body.sayi1,
                sayi2 : req.body.sayi2,
                sayi3 : req.body.sayi3,
                sayi4 : req.body.sayi4,
                sayi5 : req.body.sayi5,

            })
        })

        app.post("gostergetoplamı",async (req,res) =>{
            await personal_db.insertOne({
                gostergetoplam: req.body.gostergetoplam,
                agirlikpuani  : req.body.agirlikpuani,



            })
        })

        app.post("bosapi",async (req , res )=> {
            await personal_db.insertOne({

            })
        })







        console.log("listening")
        await app.listen(3000, "0.0.0.0")
    }
    catch (err) {
        console.log(err)
    }
}

main()