const cnt = require('../db/database')

module.exports = {
    sendMessage: (socketIO, data) => {
        const messase = data.message
        const idSender = data.sender_id
        const idCvt = data.idCvt
        const created_at = data.created_at

        const sql = "INSERT INTO `messages`(`message`, `sender_id`,`conversation_id`, `created_at`) VALUES ('" + messase + "','" + idSender + "','" + idCvt + "', '" + created_at + "')"

        cnt.query(sql, (err, result) => {
            if (err) throw err

            const getMessage = "SELECT `id`, `message`, `sender_id`, `created_at`, conversation_id FROM `messages` WHERE `conversation_id` = " + idCvt + ""

            cnt.query(getMessage, (errMess, resultMess) => {
                if (errMess) throw errMess

                // socketIO.to('chat' + idCvt).emit(`getMessage${idCvt}`, { messages: resultMess, idSender: `sender${idSender}` })
                socketIO.to('chat' + idCvt).emit(`getMessage${idCvt}`, { messages: resultMess, idSender: idSender })
            })
        })
    }
}
