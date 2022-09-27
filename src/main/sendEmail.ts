import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { AlertConfig } from "./alertConfig";
import { ServerLogins } from "./serverlogins";
import { LinuxStat } from "./ssh";

const EmojiSubject = [
    "🐿️",
    "(*￣m￣)",
    "（｀Δ´）！",
    "<(｀^´)>",
    "(╯°□°）╯︵ ┻━┻",
    "(;¬_¬)",
    "ヾ( ･`⌓´･)ﾉﾞ",
    "(┙>∧<)┙",
];

const toName = [
    '废物',
    '白痴',
    '断脊野狗',
    '老板',
    '变态',
    '蠕动的蛆',
];

const hostDownSubject = [
    '服务器没了',
    '连不上服务器',
    '完蛋了'
];

const cpuSubject = [
    'CPU转太快了',
    '处理器超载',
    '处理器超忙'
];

const memSubject = [
    '内存满了',
    '内存不够',
];

const diskSubject = [
    '磁盘满了',
    '硬盘满了',
    '存不下了'
];

// [0, max-1]
function rand(max: number) {
    return Math.floor(Math.random() * (max - 1));
}

function randStr(ss: string[]): string {
    return ss[rand(ss.length)];
}


export async function SendMail(
    conf: AlertConfig,
    login: ServerLogins,
    stat: LinuxStat,
    cpu: boolean,
    mem: boolean,
    disk: boolean,
    hostDown: boolean) {
    const transporter = nodemailer.createTransport({
        host: conf.fromHost,
        port: conf.fromPort,
        secure: conf.fromSecure,
        auth: {
            user: conf.fromEmail,
            pass: conf.fromPassword,
        },
    });

    let subject = randStr(EmojiSubject) + ' ' + login.name;
    let first = false;
    if (cpu) {
        first = true;
        subject = subject + ' ' + randStr(cpuSubject);
    }
    if (mem) {
        subject = subject + first ? ' ' : '，' + randStr(memSubject);
        first = true;
    }
    if (disk) {
        subject = subject + first ? ' ' : '，' + randStr(diskSubject);
    }
    if (hostDown) {
        subject = subject + first ? ' ' : '，' + randStr(hostDownSubject);
    }

    subject = subject + '，' + randStr(toName) + '！';

    let text =
        `服务器名称: ${login.name}
服务器地址: ${login.host}:${login.port}
CPU 占用率: ${stat.cpuload}
内存占用率: ${stat.memUsePercent}
磁盘占用率： 
    `;
    stat.disks.map((dt) => {
        text = text + '\t' + dt.name + `: ${dt.usePercent}` + '\n';
    });

    text += '\n' + new Date().toISOString() + '\n';

    const info = await transporter.sendMail({
        from: '"小凶许" ' + conf.fromEmail, // sender address
        to: conf.toEmail, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
}