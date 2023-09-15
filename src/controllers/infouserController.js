const cnt = require('../db/database')
const customImg = require('../utils/customImgUtil')

module.exports = {
    getUsers: (socketIo, data) => {
        const sql = "SELECT user_id, user_name, status_id, avatar, account_id FROM `infomation_user` JOIN `accounts` ON infomation_user.account_id = accounts.id"

        cnt.query(sql, (err, result) => {
            if (err) throw err

            const customfile = result.map(item => {
                return {
                    ...item,
                    avatar: customImg(item.avatar)
                }
            })

            socketIo.emit('usersresponse', customfile)
        })
    },
    getUserById: (req, res) => {
        const idUser = req.params.id

        const sql = "SELECT `user_name`,`avatar`,status_id  FROM `infomation_user` JOIN `accounts` ON accounts.id = infomation_user.account_id WHERE `user_id` = " + idUser + ""

        cnt.query(sql, (err, result) => {
            if (err) throw err

            res.send({
                ...result[0],
                avatar: customImg(result[0].avatar)
            })
        })
    }
}