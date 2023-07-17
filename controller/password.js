const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const Forgotpassword = require('../model/password');

const forgotpassword = async (req, res, next) => {
    try {
        const { mail } = req.body;

        const user = await User.findOne( { mail } );
        if (user) {
            const uid = uuid.v4();
            console.log(uid);

            const forgotPassword = new Forgotpassword({ uuid: uid, active: true, userId: user._id});
            forgotPassword.save()
            .then(result=>{
                console.log(result);
            })
            .catch(err => console.log(err));
            // user.createForgotpassword({ id: uid, active: true })
            //     .catch(err => {
            //         throw new Error(err)
            //     })

            const client = Sib.ApiClient.instance
            let apiKey = client.authentications['api-key']
            apiKey.apiKey = process.env.SIB_API_KEY;

            const tranEmailApi = new Sib.TransactionalEmailsApi()
            const sender = {
                email: 'singh.vishnu8369@gmail.com'
            }
            const recievers = [{ email: mail }]

            const msg = {
                sender,
                to: recievers,
                subject: 'Reset Password',
                textContent: 'and easy to do anywhere, even with Node.js',
                htmlContent: `<a href="http://localhost:3000/password/resetpassword/${uid}"><button color="blue" border-radius="5px">Reset password</button></a>`,
            }

            tranEmailApi
                .sendTransacEmail(msg)
                .then((response) => {
                    return res.json({ message: 'Link to reset password sent to your mail ', sucess: true })
                })
                .catch((err) => {
                    console.log(err)
                    res.status(400).json({error: err});
                    
                })

        } else {
            res.json({ message: 'user do not exist' });
        }
    } catch (err) {
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

};

const resetpassword = async (req, res) => {
    const id = req.params.id;

    Forgotpassword.findOne({uuid: id })
        .then(forgotpassword => {
            console.log(forgotpassword);
            if (forgotpassword) {
                res.status(200).send(`<html lang="en">

                        <head>
                            <meta charset="UTF-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style>
                                /* Desktop view */
                                body {
                                    background-image: url(https://www.boardandlife.com/wp-content/uploads/2019/09/monthly-expense-tracker-desk-space.jpg);
                                    background-size: cover;
                                }
                        
                                form {
                                    margin-left: 10%;
                                    margin-right: 10%;
                                }
                        
                                .outputMsg {
                                    color: red;
                                }
                        
                                .signBody {
                                    background-color: rgba(0, 0, 0, 0.5);
                                    align-items: center;
                                    border: 2px solid transparent;
                                    box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.5);
                                    padding: 5px;
                                    width: 30%;
                                    border-radius: 8px;
                                    margin-top: 5%;
                                    margin-left: auto;
                                    margin-right: auto;
                                }
                        
                                .title {
                                    margin-left: 35%;
                                    margin-right: auto;
                                    color: aliceblue;
                                }
                        
                                .message {
                                    margin-left: 25%;
                                    margin-right: auto;
                                    color: aliceblue;
                                }
                        
                                label {
                                    font-size: large;
                                    color: aliceblue;
                                }
                        
                                input {
                                    height: 25px;
                                    width: 100%;
                                    border: none;
                                    border-radius: 3px;
                                    background-color: #e5e5e5;
                                }
                        
                                button {
                                    display: block;
                                    padding: 10px 20px;
                                    margin: 0 auto;
                                    margin-top: 10%;
                                    margin-left: auto;
                                    margin-right: auto;
                                    width: 80%;
                                    height: 40px;
                                    font-size: large;
                                    color: darkslategray;
                                    background-color: aqua;
                                    border-radius: 8px;
                                }
                        
                                .forgotPara {
                                    margin-left: 33%;
                                    margin-right: auto;
                                    color: aliceblue;
                                }
                        
                                .para {
                                    margin-left: 21%;
                                    margin-right: auto;
                                    color: aliceblue;
                                }
                        
                                /* Mobile view */
                                @media (max-width: 767px) {
                                    body {
                                        background-position: left;
                                    }
                        
                                    form {
                                        margin: 0 5%;
                                    }
                        
                                    .signBody {
                                        width: 80%;
                                        margin-top: 10%;
                                    }
                        
                                    .title {
                                        margin-left: auto;
                                        margin-right: auto;
                                        text-align: center;
                                    }
                        
                                    .message {
                                        margin-left: auto;
                                        margin-right: auto;
                                        text-align: center;
                                    }
                        
                                    input,
                                    button {
                                        width: 100%;
                                    }
                        
                                    button {
                                        margin-top: 20px;
                                        margin-bottom: 20px;
                                    }
                        
                                    .loginLink {
                                        margin-left: auto;
                                        margin-right: auto;
                                        text-align: center;
                                    }
                        
                                    .signBody {
                                        max-height: 100vh;
                                        overflow-y: scroll;
                                    }
                                }
                            </style>
                            <!-- <link rel="stylesheet" href="../css/newsign.css"> -->
                            <title>Update Password</title>
                        </head>
                        
                        <body>
                            <div>
                                <div class="signBody" id="signBody">
                                <h3 class="outputMsg" id="outputMsg"></h3>
                                    <form>
                                        <label for="newPass">Enter New Password: </label>
                                        <input type="text" id="newPass">
                                        <br>
                                        <button id="formSubmit">Submit</button>
                                    </form>
                                </div>
                            </div>
                            <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
                            <script>
                                document.getElementById('formSubmit').onclick = async function (e) {
                                    e.preventDefault();
                                    const newPass = document.getElementById('newPass').value;
                                    const obj = {
                                        newPass
                                    }
                                    console.log(obj);
                                    const updatepassword = await axios.post('http://localhost:3000/password/updatepassword/${id}', obj);
                                    console.log(updatepassword);
                                    document.getElementById('outputMsg').innerHTML = updatepassword.data.message;
                                    setTimeout(() => {
                                        document.getElementById('outputMsg').innerHTML = '';
                                        window.location.href = "file:///C:/Users/Vishnu/Desktop/web%20devlopment/expenceTracker/frontEnd/html/login.html";
                                    }, 4000);
                                    document.getElementById('newPass').value = '';
                                }
                            </script>
                        </body>
                        
                </html>`);
            } else {
                res.status(404).message({message: 'Not found', status: false});
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal server error');
        });
};

const updatepassword = async (req, res) => {
    try {
        const { newPass } = req.body;
        const uid = req.params.id;

        const forgotpassword = await Forgotpassword.findOne({ uuid: uid } );
        console.log(forgotpassword);
        if (forgotpassword.active == true) {
            const user = await User.findOne( {_id: forgotpassword.userId });
            console.log(user);
            if (user) {
                const hash = await bcrypt.hash(newPass, 10);
                // const updpass = await user.update({ password: hash });
                user.password = hash;
                await user.save();
                res.status(200).json({ message: 'Password updated Successfully' });
                forgotpassword.active = false;
                forgotpassword.save().catch(err => console.log(err));
            } else {
                res.status(400).json({ message: 'user not found' })
            }
        } else {
            res.json({ message: 'Please generate new link' });
        }

    } catch (error) {
        console.log(error);
        return res.status(403).json({ error, success: false })
    }
}

module.exports = {
    forgotpassword,
    resetpassword,
    updatepassword
}