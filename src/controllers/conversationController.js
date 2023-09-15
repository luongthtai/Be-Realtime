const cnt = require('../db/database')
const customImg = require('../utils/customImgUtil')

module.exports = {
    createConversation: (req, res) => {
        const idUser = req.params.idUser
        const idAccount = req.params.idAccount

        const checkConversation = "select id from `conversations` where (`sender_id` = " + idUser + " and `receiver_id` = " + idAccount + ") or (`sender_id` = " + idAccount + " and `receiver_id` = " + idUser + ")"

        cnt.query(checkConversation, (errCheck, resultCheck) => {
            if (errCheck) throw errCheck

            if (resultCheck.length === 0) {
                const sql = "INSERT INTO `conversations`(`sender_id`, `receiver_id`) VALUES ('" + idAccount + "','" + idUser + "')"

                cnt.query(sql, (err, result) => {
                    if (err) throw err

                    cnt.query(checkConversation, (errIdCvt, resultIdCvt) => {
                        if (errIdCvt) throw errIdCvt

                        res.send({ idCvtSuccess: resultIdCvt[0].id })
                    })
                })
            } else {
                res.send({ idCvt: resultCheck[0].id })
            }
        })
    },
    getConversationByIdAccount: (req, res) => {
        // const idAccount = req.params.id

        // const filterSender = "SELECT c.`id`, c.`name_conversation`, c.receiver_id,  i.user_name, i.avatar, a.status_id FROM `conversations` c JOIN `infomation_user` i ON (i.`account_id` = c.`receiver_id`) JOIN `accounts` a ON (a.id = i.account_id) WHERE `c`.`sender_id` = " + idAccount + " GROUP BY c.`id` ASC"

        // cnt.query(filterSender, (errSender, resultSender) => {
        //     if (errSender) throw errSender

        //     const filterReceiver = "SELECT c.`id`, c.`name_conversation`, c.sender_id,  i.user_name, i.avatar, a.status_id FROM `conversations` c JOIN `infomation_user` i ON (i.`account_id` = c.`sender_id`) JOIN `accounts` a ON (a.id = i.account_id) WHERE `c`.`receiver_id` = " + idAccount + " GROUP BY c.`id` ASC"

        //     cnt.query(filterReceiver, (errReceiver, resultReceiver) => {
        //         if (errReceiver) throw errReceiver

        //         const customSender = resultSender.map(item => {
        //             return {
        //                 ...item,
        //                 avatar: customImg(item.avatar)
        //             }
        //         })

        //         const customReceiver = resultReceiver.map(item => {
        //             return {
        //                 ...item,
        //                 avatar: customImg(item.avatar)
        //             }
        //         })

        //         const newResult = {
        //             receiver: customReceiver,
        //             sender: customSender
        //         }

        //         res.send(newResult)
        //     })
        // })
    },
    getConversationByIdCvt: (req, res) => {
        // const idCvt = req.params.idCvt
        // const idAccount = req.params.idAccount

        // const getMess = "SELECT m.id, m.message, m.conversation_id, m.sender_id, m.created_at FROM `messages` m JOIN `conversations` c ON c.id = m.conversation_id WHERE m.conversation_id = " + idCvt + ""

        // const sql = "SELECT i.user_id, i.user_name, i.avatar, a.status_id FROM `infomation_user` i JOIN `accounts` a ON a.id = i.account_id JOIN `conversations` c ON c.id = " + idCvt + " AND( (a.id = c.sender_id) OR(a.id = c.receiver_id) ) WHERE a.id != " + idAccount + ""

        // cnt.query(sql, (err, result) => {
        //     if (err) throw err

        //     const customUser = result.map(item => {
        //         return {
        //             ...item,
        //             avatar: customImg(item.avatar)
        //         }
        //     })

        //     cnt.query(getMess, (errMess, resultMess) => {
        //         if (errMess) throw errMess

        //         const response = {
        //             user: customUser[0],
        //             message: resultMess
        //         }

        //         res.send(response)
        //     })
        // })
    },
    getConversationSocket: (socketIo, data) => {
        const filterSender = "SELECT c.`id`, c.`name_conversation`, c.receiver_id,  i.user_name, i.avatar, a.status_id FROM `conversations` c JOIN `infomation_user` i ON (i.`account_id` = c.`receiver_id`) JOIN `accounts` a ON (a.id = i.account_id) WHERE `c`.`sender_id` = " + data + " GROUP BY c.`id` ASC"

        cnt.query(filterSender, (errSender, resultSender) => {
            if (errSender) throw errSender

            const filterReceiver = "SELECT c.`id`, c.`name_conversation`, c.sender_id,  i.user_name, i.avatar, a.status_id FROM `conversations` c JOIN `infomation_user` i ON (i.`account_id` = c.`sender_id`) JOIN `accounts` a ON (a.id = i.account_id) WHERE `c`.`receiver_id` = " + data + " GROUP BY c.`id` ASC"

            cnt.query(filterReceiver, (errReceiver, resultReceiver) => {
                if (errReceiver) throw errReceiver

                const customSender = resultSender.map(item => {
                    return {
                        ...item,
                        avatar: customImg(item.avatar)
                    }
                })

                const customReceiver = resultReceiver.map(item => {
                    return {
                        ...item,
                        avatar: customImg(item.avatar)
                    }
                })

                const newResult = {
                    receiver: customReceiver,
                    sender: customSender
                }

                socketIo.to('conversations' + data).emit("conversationsById", newResult);
            })
        })
    },
    getConversationSocketItem: (socketIo, data) => {
        const idCvt = data.idCvt
        const idAccount = data.idAccount

        const getMess = "SELECT m.id, m.message, m.conversation_id, m.sender_id, m.created_at FROM `messages` m JOIN `conversations` c ON c.id = m.conversation_id WHERE m.conversation_id = " + idCvt + ""

        const sql = "SELECT i.user_id, i.user_name, i.avatar, a.status_id FROM `infomation_user` i JOIN `accounts` a ON a.id = i.account_id JOIN `conversations` c ON c.id = " + idCvt + " AND( (a.id = c.sender_id) OR(a.id = c.receiver_id) ) WHERE a.id != " + idAccount + ""

        cnt.query(sql, (err, result) => {
            if (err) throw err

            const customUser = result.map(item => {
                return {
                    ...item,
                    avatar: customImg(item.avatar)
                }
            })

            cnt.query(getMess, (errMess, resultMess) => {
                if (errMess) throw errMess

                const response = {
                    user: customUser[0],
                    message: resultMess
                }

                socketIo.to('chat' + idCvt).emit('getChat' + idAccount, response)
            })
        })
    }
}