import email from "infra/email.js";
import database from "infra/database.js";
import webserver from "infra/webserver.js";

const EXPIRATION_IN_MILISECONDS = 60*15*1000 // 15 minutes

async function findOneByUserId(userId) {
    const newToken = await runSelectQuery(userId);
    return newToken;

    async function runSelectQuery(userId) {
        const results = await database.query({
            text: `
                SELECT
                    *
                FROM
                    user_activation_tokens
                WHERE
                    user_id = $1
                LIMIT
                    1
            ;`,
            values: [userId]
        });

        return results.rows[0];
    }
}

async function create(userId) {
    const expireAt = new Date(Date.now() + EXPIRATION_IN_MILISECONDS)

    const newToken = await runInsertQuery(userId, expireAt);
    return newToken;

    async function runInsertQuery(userId, expireAt) {
        const results = await database.query({
            text: `
                INSERT INTO
                    user_activation_tokens (user_id, expires_at)
                VALUES
                    ($1, $2)
                RETURNING
                    *
            ;`,
            values: [userId, expireAt]
        });

        return results.rows[0];
    };
};

async function sendEmailToUser(user, activationToken) {
    await email.send({
        from: "AgrDrive <contato@agrdrive.com.br>",
        to: user.email,
        subject: "Ative seu cadastro no AgrDrive!",
        text: `${user.username}, clique no link abaixo para ativar seu cadastro no AgrDrive:
        
${webserver.origin}/ativar/${activationToken.id}

Atenciosamente,
Equipe AgrDrive`,
    })
}

const activation = {
    sendEmailToUser,
    create,
    findOneByUserId,
}

export default activation