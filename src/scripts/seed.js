import {readFile} from 'node:fs/promises';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import {connectDB} from '../../configuration/db.js';
import Member from '../models/member.model.js';

const seedMembers = async () => {
    const fileUrl = new URL('../../seed-members.json', import.meta.url);
    const content = await readFile(fileUrl, 'utf8');
    const members = JSON.parse(content);

    if (!Array.isArray(members) || members.length === 0) {
        throw new Error('Ожидается непустой массив участников');
    }

    // Проверяем весь файл до записи в базу.
    const logins = new Set();

    for (const member of members) {
        if (
            !member
            || typeof member.name !== 'string'
            || !member.name.trim()
            || typeof member.login !== 'string'
            || !member.login.trim()
            || typeof member.password !== 'string'
            || !member.password
            || Buffer.byteLength(member.password, 'utf8') > 72
            || !['member', 'planner'].includes(member.role)
        ) {
            throw new Error('Некорректные данные участника');
        }

        const login = member.login.trim().toLowerCase();

        if (logins.has(login)) {
            throw new Error('В файле есть повторяющиеся логины');
        }

        logins.add(login);
    }

    await connectDB();
    await Member.init();

    let created = 0;
    let skipped = 0;

    for (const member of members) {
        const login = member.login.trim().toLowerCase();
        const existingMember = await Member.findOne({login}).exec();

        if (existingMember) {
            skipped++;
            continue;
        }

        const passwordHash = await bcrypt.hash(member.password, 12);

        const memberAccount = new Member({
            name: member.name,
            login,
            passwordHash,
            role: member.role,
        });

        await memberAccount.save();
        created++;
    }

    console.log(`Создано: ${created}, пропущено: ${skipped}`);
}

try {
    await seedMembers();
} catch {
    console.error('Не удалось заполнить базу. Проверьте файл участников и подключение MongoDB.');
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
