import express, { response } from 'express';
import {Client} from 'pg';
import cors from 'cors'
import bodyParser, { urlencoded } from 'body-parser'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import AWS from 'aws-sdk'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'



dotenv.config()

const transporter = nodemailer.createTransport({
    service:"Gmail", 
    auth:{
        user:process.env.email,
        pass:process.env.emailpassword
    }
})


AWS.config.update({
        signatureVersion:'v4',
        accessKeyId:process.env.accessKeyId,
        secretAccessKey:process.env.secretAccessKey,
        region:'us-west-1'
})

const s3 = new AWS.S3(
   
)



const saltRounds = 10

const app = express()

const client = new Client({
    host:'localhost', 
    port:5432, 
    user:process.env.datauser, 
    password:process.env.datapassword
})
app.use( express.static( `${__dirname}/../build` ) );
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cors())
client.connect()
.then(() => console.log('connect success'))
.catch((err:Error) => console.log('connect error'))

app.get('/', (req, res) => {
    res.send('Hello There')
})

app.post('/', (req, res) => {
    const currentUser = `SELECT username, password, user_id FROM passwds WHERE username = $1`
    const newSession = 'UPDATE sessions SET session_id=$1, user_id=$2 WHERE user_id = $3'
    
    client.query(currentUser, [req.body.username]).then(response => {
        if (!response.rows[0]) {
            res.send('No username found')
        }
        else {
            bcrypt.compare(req.body.password, response.rows[0].password).then(result => {
                if (result) {
                    crypto.randomBytes(64, (err, buffer) => {
                        if (err) {
                            console.log(err)
                        return
                        }
                        const token = buffer.toString('hex')
                        client.query(newSession, [token, response.rows[0].user_id, response.rows[0].user_id]) 
                        res.send({result, token, user_id:response.rows[0].user_id})
                    })
                }
                else {
                    res.send({result})

                }
                
            })
        }
    }).catch(err => {
        console.log(err)
    })    
})

app.post('/email-request', (req, res) => {
console.log(req.body)
    interface templateParam{
                from:string
                to: string
                subject:string
                html?: string
                text?:string
    }

    const templateParams:templateParam = {
                from: '"Tosin Kuye" <tkuye77@gmail.com>"',
                to: req.body.reply_email,
                subject: "Thank you " + req.body.from_name + ", your message has been received.",
                html: "<p>Thank you for your message, we will respond to you shortly.</p><p>Kind regards,</p><p><b>DATT Team</b></p>",
    }

    const sendParams:templateParam = {
        from: '"Tosin Kuye" <tkuye77@gmail.com>"',
                to:"tkuye77@gmail.com",
                subject: "New message from " + req.body.from_name,
                text: req.body.message,
    }

    transporter.sendMail(templateParams, (err, info) => {
        if (err) throw err
    })

    transporter.sendMail(sendParams, (err, info) => {
        if (err) throw err
    })
    
    
    res.sendStatus(200)
})
app.get('/int-number', (req, res) => {
    console.log(req.query.id)
    let InterestQuery = "SELECT int_total FROM interest_total WHERE id_event=$1"
    client.query(InterestQuery, [req.query.id]).then(response => {
        console.log(response)
        res.send(response.rows[0])
    })
})


app.post('/edit',(req, res) => {
    switch (req.body.tbname) {
        case 'events':
            let eventQuery = `UPDATE events SET event_name=$1, event_date=$2, iframe_form=$4, upcoming=$5 WHERE event_id = $3 RETURNING image, event_id`
            client.query(eventQuery, [req.body.title, req.body.date, req.body.id, req.body.iframe, req.body.upcoming]).then(results => {
                const params = {Bucket:process.env.bucket!, Key:"events/" + results.rows[0].event_id}
            const imageParams = {Bucket:process.env.bucket!, Key:"events/" + results.rows[0].image }
            Promise.all([new Promise((resolve, reject) => {
            s3.getSignedUrl("putObject", params, (err, url) => {
                if (err) reject(err)
                    resolve({text:url})
                })
            }), new Promise((resolve, reject) => {
                s3.getSignedUrl("putObject", imageParams, (err, url) => {
                    if (err) reject(err)
                        resolve({image:url})
                    })
                })]).then((urls) => {
                    console.log(urls)
                    res.send(urls)
                })
            })
            break
        case 'blogs':
       
            let blogQuery = `UPDATE blogs SET blog_title=$1, blog_date=$2 WHERE blog_id = $3 RETURNING image, blog_id`
            

                client.query(blogQuery, [req.body.title, req.body.date, req.body.id]).then((results) => {

            const params = {Bucket:process.env.bucket!, Key:"blogs/" + results.rows[0].blog_id}
            const imageParams = {Bucket:process.env.bucket!, Key:"blogs/" + results.rows[0].image }
            Promise.all([new Promise((resolve, reject) => {
            s3.getSignedUrl("putObject", params, (err, url) => {
                if (err) reject(err)
                    resolve({text:url})
                })
            }), new Promise((resolve, reject) => {
                s3.getSignedUrl("putObject", imageParams, (err, url) => {
                    if (err) reject(err)
                        resolve({image:url})
                    })
                })]).then((urls) => {
                    console.log(urls)
                    res.send(urls)
                })
            })
            break
        }

        })
    
app.post('/post', (req, res) => {
    
    let type = req.body.type.split('/')[1]
     
    switch (req.body.tblname) {
        case "blogs":
            let blogQuery = `INSERT INTO ${req.body.tblname}(blog_title, blog_date, user_id, image) VALUES($1, $2, $3, $4) RETURNING blog_id`
            client.query(blogQuery, [req.body.title, req.body.date, req.body.id,encodeURIComponent(req.body.title)+ `.${type}`]).then(results => {
                const params = {Bucket:process.env.bucket!, Key:"blogs/" + results.rows[0].blog_id}
            const imageParams = {Bucket:process.env.bucket!, Key:"blogs/" + encodeURIComponent(req.body.title)+ `.${type}`}
            Promise.all([new Promise((resolve, reject) => {
            s3.getSignedUrl("putObject", params, (err, url) => {
                if (err) reject(err)
                    resolve({text:url})
                })
            }), new Promise((resolve, reject) => {
                s3.getSignedUrl("putObject", imageParams, (err, url) => {
                    if (err) reject(err)
                        resolve({image:url})
                    })
                })]).then((urls) => {
                    console.log(urls)
                    res.send(urls)
                }

                )
            })
            
            break
        case "events":
            let eventQuery = `INSERT INTO ${req.body.tblname}(event_name, event_date, image, iframe_form, upcoming) VALUES($1, $2, $3, $4, $5) RETURNING event_id`
            
            client.query(eventQuery, [req.body.title, req.body.date, encodeURIComponent(req.body.title) + `.${type}`, req.body.iframe, req.body.upcoming]).then((result) => {
                let eventInterest = `INSERT INTO interest_total (int_total, id_event) VALUES ($1, $2)`
                client.query(eventInterest, [0, result.rows[0].event_id])
                const params = {Bucket:process.env.bucket!, Key:"events/" + result.rows[0].event_id}
            const imageParams = {Bucket:process.env.bucket!, Key:"events/" + encodeURIComponent(req.body.title)+ `.${type}`}
            Promise.all([new Promise((resolve, reject) => {
            s3.getSignedUrl("putObject", params, (err, url) => {
                if (err) reject(err)
                    resolve({text:url})
                })
            }), new Promise((resolve, reject) => {
                s3.getSignedUrl("putObject", imageParams, (err, url) => {
                    if (err) reject(err)
                        resolve({image:url})
                    })
                })]).then((urls) => {
                    console.log(urls)
                    res.send(urls)
                }

                )
            })
    }
})


app.get('/carousel', (req, res) => {
    console.log('hello')
    const params = {Bucket:process.env.bucket!, Prefix:process.env.carousel}
    
    s3.listObjects(params, async (err, data )=> {
        if (err) console.log(err)
        else {
            Promise.all(data.Contents!.map(row => {
                let key = row.Key
                if (key?.includes('.png') || key?.includes('.jpg')){
              return new Promise((resolve, reject) => {
               
                
                const carouselParams = {Bucket:process.env.bucket, Key:key}
                s3.getSignedUrl("getObject", carouselParams, (err, url) => {
                    if (err) reject(err)
                    
                    resolve(url)
                })
                 

              })
            }
            })).then(results => {
                res.send(results.filter(res => res !== undefined))
            })
            
            
        }
    })
})


app.get('/events', (req, res) => {
    


    const getSignedUrl =  async (item:any) => {
        return Promise.all([new Promise((resolve, reject) => {
            const params = {Bucket:process.env.bucket, Key:"events/" + item.event_id}
            s3.getSignedUrl("getObject", params, (err, url) => {
                if (err) {reject(err)}
                resolve(url)
        
            })
        }), new Promise((resolve, reject) => {
            const params = {Bucket:process.env.bucket, Key:"events/" + item.image}
            s3.getSignedUrl("getObject", params, (err, url) => {
                if (err) {reject(err)}
                resolve(url)
        
            })
        })])

    }
    async function processItems(items:any) {
        
            let proccessed = items.map(async (item:any) => {[item.url, item.image] = await getSignedUrl(item); return item})
        
            return Promise.all(proccessed)
}
const fetchItems = `SELECT e.event_id, e.event_name, e.event_date, e.image, e.upcoming, e.iframe_form, i.int_total FROM events e  INNER JOIN interest_total i ON e.event_id =  i.id_event`
    client.query(fetchItems).then((result) => {
        processItems(result.rows).then(results => {
            
            res.send(results)
        })
    })
 })

app.delete('/post', (req, res) => {
    let type = req.query.type

    if (type === 'blogs') {
        let deleteS3 = "SELECT image FROM blogs WHERE blog_id = $1"
        client.query(deleteS3, [req.query.id]).then(result => {
            const params = {Bucket:process.env.bucket as string, Key:'blogs/' + result.rows[0].image}
                s3.deleteObject(params, (err, data) => {
                    if (err) throw err
                })
        })
    } 
    else if (type === "events") {
        let deleteS3 = "SELECT image FROM blogs WHERE event_id = $1"
        client.query(deleteS3, [req.query.id]).then(result => {
            const params = {Bucket:process.env.bucket as string, Key:'events/' + result.rows[0].image}
                s3.deleteObject(params, (err, data) => {
                    if (err) throw err
                })
        })
    }
    
    const deleteParams = {Bucket:process.env.bucket as string, Key:type + '/' + req.query.id}

    s3.deleteObject(deleteParams, (err, data) => {
        if (err) throw err
    })

    let deleteQuery = `DELETE FROM ${type} WHERE ${String(type).slice(0, -1)}_id = $1`
    client.query(deleteQuery, [req.query.id])
})


app.post('/user', (req, res) => {
    
    
        
    
    if (req.body.key) {
        
        
       

        if (req.body.imgtype && !req.body.vidtype) {
            const imgType  = `.${req.body.imgtype.split('/')[1]}`
            const params = {
                Key:req.body.key + imgType, 
                Bucket:process.env.bucket!,
                ContentType:'application/octet-stream'
            }
            const setUser = "INSERT INTO user_desc (name, description, img_location, user_id) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO UPDATE SET name=$1, description=$2, img_location=$3"
            client.query(setUser, [req.body.name, req.body.description, req.body.key + imgType, req.body.id])
            s3.getSignedUrl('putObject', params, async (err, url) => {
                res.send(url)
                
            })
        }
        else if (req.body.vidtype && !req.body.imgtype) {
            const vidType = `.${req.body.vidtype.split('/')[1]}`
            const vidParams = {
                Key:req.body.key + vidType, 
                Bucket:process.env.bucket!,
                ContentType:'application/octet-stream'
            }
            const setUser = "INSERT INTO user_desc (name, description, video, user_id) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO UPDATE SET name=$1, description=$2, video=$3"
            client.query(setUser, [req.body.name, req.body.description, req.body.key + vidType, req.body.id])
            s3.getSignedUrl('putObject', vidParams, async (err, url) => {
                res.send(url)
                
            })

        }
        else {
            const vidType = `.${req.body.vidtype.split('/')[1]}`
            const imgType  = `.${req.body.imgtype.split('/')[1]}`
            const params = {
                Key:req.body.key + imgType, 
                Bucket:process.env.bucket!,
                ContentType:'application/octet-stream'
            }
            const vidParams = {
                Key:req.body.key + vidType, 
                Bucket:process.env.bucket!,
                ContentType:'application/octet-stream'
            }
        
            
                const setUser = "INSERT INTO user_desc (name, description, img_location, user_id, video) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id) DO UPDATE SET name=$1, description=$2, img_location=$3, video=$5"
            client.query(setUser, [req.body.name, req.body.description, req.body.key + imgType, req.body.id, req.body.key + vidType])
                
            async function generateUrls() {
                let urls:{video:string; image:string} = {video:'', image:''}
                s3.getSignedUrl('putObject', params, async (err, url) => {
                    urls.image = url
                    
                })
                s3.getSignedUrl('putObject', vidParams, async (err, url) => {
                    
                    urls.video = url
                })
                return urls
            }
            generateUrls().then((urls) => {
                console.log(urls)
                res.send(urls)
            })
        }
    

    }
   
    else {
        const setUser = "INSERT INTO user_desc (name, description, user_id) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET name=$1, description=$2"
        client.query(setUser, [req.body.name, req.body.description, req.body.id])
        res.send('success')
    }
})
//})


app.get('/blog-image', (req, res) => {
    const params = {
        Key:"blogs/" +  req.query.key, 
        Bucket:process.env.bucket
    }
    s3.getSignedUrl('getObject', params, (err, url) => {
        res.send(url)
    })
})


app.get('/user', (req, res) => {

    const getUser = "SELECT name, description, img_location FROM user_desc WHERE user_id = $1"
    client.query(getUser, [req.query.id]).then((result) => {
        if (result.rowCount > 0) {
        const params = {Bucket:process.env.bucket!, Key:result.rows[0].img_location}
            s3.getSignedUrl("getObject", params, (err, url) => {
                res.send({rows:result.rows, url})
            })
        }
        else {
            res.send({rows:""})
        }
            
        
    })
})

app.get('/users', (req, res) => {

    const getSignedUrl =  async (item:any) => {
        return Promise.all([ new Promise((resolve, reject) => {
            const params = {Bucket:process.env.bucket, Key:item.img_location}
            s3.getSignedUrl("getObject", params, (err, url) => {
                if (err) {reject(err)}
                resolve(url)
        
            })
        }), new Promise((resolve, reject) => {
            const params = {Bucket:process.env.bucket, Key:item.video}
            s3.getSignedUrl("getObject", params, (err, url) => {
                if (err) {reject(err)}
                resolve(url)
        
            })
        })])

    }
    
    async function processItems(items:any) {
        
            let proccessed = items.map(async (item:any) => {[item.image, item.video] = await getSignedUrl(item);return item})

            return Promise.all(proccessed)
}
    
    const promises:any[] = [];
    const getUsers = "SELECT name, description, img_location, video FROM user_desc"
    client.query(getUsers).then((result) => {
        processItems(result.rows).then(results => {
            
            res.send(results)
        })
    })
    
})

app.post('/new-user', (req, res) => {
    const newUser = "INSERT INTO passwds (username, password) VALUES ($1, $2)"
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) throw err
        client.query(newUser, [req.body.username, hash])
        res.send('success')
    })
})

app.post('/existing-user', (req, res) => {
    const checkUser = "SELECT username FROM passwds WHERE username = $1"
    client.query(checkUser, [req.body.username]).then((result) => {
        result.rowCount > 0?res.send(true):res.send(false)
    })  
})

app.get('/mission', (req, res) => {
    const getMission = "SELECT * FROM mission"
    client.query(getMission).then((result) => {
        res.send(result.rows[0])
    })
})

app.post('/mission', (req, res) => {
    const sendMission = "UPDATE mission SET name = $1"
    client.query(sendMission, [req.body.mission])
    res.sendStatus(200)
})

app.get('/interest', (req, res) => {
    const interestQuery = "SELECT e.event_name, i.int_total FROM interest_total i INNER JOIN events e ON i.id_event = e.event_id;"
    client.query(interestQuery).then(result => {
        res.send(result.rows)
    })
})

app.get('/emails', (req, res) => {
    const emailQuery = "SELECT email FROM emails"
    client.query(emailQuery).then(result => {
        let file = new String()
        result.rows.forEach(row => {
            file += row.email + '\n'
        })
        
        res.send(file)
    })
    
})

app.put('/new-interest', (req, res) => {
    const newInterestQuery = "UPDATE interest_total SET int_total = int_total + 1 WHERE id_event= $1 RETURNING int_total"
    req.body.id
    client.query(newInterestQuery, [req.body.id]).then(result => {
        res.send(result.rows[0])
    })
})

app.get('/current-interest', (req, res) => {
    const currentInterestQuery = "SELECT int_total FROM interest_total WHERE id_event= $1"
    client.query(currentInterestQuery, [req.query.id]).then((result) => {
        res.send(result.rows[0])
    })
})

app.get('/blogs', (req, res) => {

    const getSignedUrl =  async (item:any) => {
        return Promise.all([new Promise((resolve, reject) => {
            const params = {Bucket:process.env.bucket, Key:"blogs/" + item.blog_id}
            s3.getSignedUrl("getObject", params, (err, url) => {
                if (err) {reject(err)}
                resolve(url)
        
            })
        }), new Promise((resolve, reject) => {
            const params = {Bucket:process.env.bucket, Key:"blogs/" + item.image}
            s3.getSignedUrl("getObject", params, (err, url) => {
                if (err) {reject(err)}
                resolve(url)
        
            })
        })])

    }
    async function processItems(items:any) {
        
            let proccessed = items.map(async (item:any) => {[item.url, item.image] = await getSignedUrl(item); return item})
        
            return Promise.all(proccessed)
}
    const blogQuery = "SELECT b.blog_title, b.blog_id, b.blog_date, b.image, u.name FROM blogs b INNER JOIN user_desc u ON b.user_id = u.user_id"
    client.query(blogQuery).then((result) => {
        processItems(result.rows).then(results => {
            res.send(results)
        })
    })
})

app.post('/email', (req, res) => {
    const emailQuery = "INSERT INTO emails (email) VALUES ($1)"
    client.query(emailQuery, [req.body.email]).then(() => {
        res.sendStatus(200)
    })
})

app.get('/blog', (req, res) => {
    let blogQuery = "SELECT b.blog_title, b.blog_id, b.blog_date, b.blog_details, b.img_key, u.name FROM blogs b INNER JOIN user_desc u ON b.user_id = u.user_id WHERE b.blog_id = $1"
    client.query(blogQuery, [req.query.id]).then(results => {
        const params = {Bucket:process.env.bucket, Key:"blogs/" + results.rows[0].img_key}
        s3.getSignedUrl("getObject", params, (err, url) => {
            results.rows[0].url = url
            res.send(results.rows[0])
      })
    })
})


const path = require('path')
app.get('*', (req, res)=>{  res.sendFile(path.join(__dirname, '../build/index.html'));})

app.listen(8000, () => 
console.log('server started on port http://localhost:8000'))