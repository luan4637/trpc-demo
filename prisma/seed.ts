import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';


const crypto = require('crypto');
const hashPassword = (password: string) => {
    return crypto.createHash('sha256').update(password).digest('hex')
}

const userPassword = hashPassword('123456');

const prisma = new PrismaClient()
async function main() {
    await prisma.user.createMany({
        data: [
            {
                id: uuidv4(),
                name: 'Luan',
                avatar: '',
                email: 'luan4637@gmail.com',
                password: userPassword
            },
            {
                id: uuidv4(),
                name: 'Susan',
                avatar: '',
                email: 'susan@mail.private',
                password: userPassword
            },
            {
                id: uuidv4(),
                name: 'Larry',
                avatar: '',
                email: 'larry@mail.private',
                password: userPassword
            },
            {
                id: uuidv4(),
                name: 'Peter',
                avatar: '',
                email: 'peter@mail.private',
                password: userPassword
            },
            {
                id: uuidv4(),
                name: 'Alice',
                avatar: '',
                email: 'alice@mail.private',
                password: userPassword
            }
        ]
    });

    await prisma.ticket.createMany({
        data: [
            {
                id: uuidv4(),
                title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                description: '',
                assigneeId: null
            },
            {
                id: uuidv4(),
                title: 'It has roots in a piece of classical Latin literature',
                description: '',
                assigneeId: null
            },
            {
                id: uuidv4(),
                title: 'The standard chunk of Lorem Ipsum used since',
                description: '',
                assigneeId: null
            },
            {
                id: uuidv4(),
                title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
                description: '',
                assigneeId: null
            },
            {
                id: uuidv4(),
                title: 'It is a long established fact that a reader will be distracted',
                description: '',
                assigneeId: null
            }
        ]
    });
}

main().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
});
