const cnt = require('../db/database')
const customImg = require('../utils/customImgUtil')

module.exports = {
    resgister: (req, res) => {
        const data = req.body

        const account = data.account
        const password = data.password
        const userName = data.userName

        const sql = "INSERT INTO `accounts`( `account_name`, `password`) VALUES ('" + account + "','" + password + "')"

        cnt.query(sql, (err, result) => {
            if (err) throw err

            if (result) {
                const sqlGetIdAccount = "SELECT `id` FROM `accounts` WHERE `account_name` = '" + account + "' AND `password` = '" + password + "'"

                cnt.query(sqlGetIdAccount, (errGetId, resultGetId) => {
                    if (errGetId) throw errGetId

                    if (resultGetId.length !== 0) {
                        const insetInfoUser = "INSERT INTO `infomation_user`(`user_name`, `account_id`) VALUES ('" + userName + "', '" + resultGetId[0].id + "')"

                        cnt.query(insetInfoUser, (error, results) => {
                            if (error) throw error

                            if (result) {
                                res.send(true)
                            } else {
                                res.send(false)
                            }
                        })
                    } else {
                        res.send(false)
                    }
                })
            }
        })
    },
    login: (req, res) => {
        const data = req.body

        const account = data.userName
        const password = data.password

        const sql = "SELECT * FROM `accounts` WHERE `account_name` = '" + account + "' AND `password` = '" + password + "'" // kiem tra login

        cnt.query(sql, (err, result) => {
            if (err) throw err

            if (result.length !== 0) {
                const updateStatusUser = "UPDATE `accounts` SET `status_id`='1' where `id` = '" + result[0].id + "'" // cap nhat trang thai dang nhap

                cnt.query(updateStatusUser, (errorStatusUser, resultStatusUser) => {
                    if (errorStatusUser) throw errorStatusUser

                    const getInfoUser = "SELECT user_id, user_name, avatar, account_id FROM `infomation_user` WHERE `account_id` = " + result[0].id + "" // lay thong tin user

                    cnt.query(getInfoUser, (errGetUser, resultUser) => {
                        if (errGetUser) throw errGetUser

                        res.send({
                            ...resultUser[0],
                            avatar: customImg(resultUser[0].avatar),
                        })
                    })
                })
            } else {
                res.send(false)
            }
        })
    },
    logout: (socket, data) => {
        const sql = "UPDATE `accounts` SET `status_id`='2' where `id` = '" + data.idAccount + "'"

        cnt.query(sql, (err, result) => {
            if (err) throw err

            console.log("logout !!")
        })
    },
}