import bcrypt from 'bcrypt';
import Member from '../models/member.model.js';

export async function login(login, password) {
    const member = await Member.findOne({ login }).select('+passwordHash');
    const validPassword = member && await bcrypt.compare(password, member.passwordHash);

    if (!validPassword) {
        const error = new Error('Неверный логин или пароль');
        error.status = 401;
        error.code = 'INVALID_CREDENTIALS';
        throw error;
    }
    return {
        id: member.id,
        name: member.name,
        role: member.role,
    };
}


export async function getCurrentMember(memberId) {
    const member = await Member.findById(memberId)
        .select('name role');

    if (!member) {
        const error = new Error('Необходимо войти в систему');
        error.status = 401;
        error.code = 'UNAUTHENTICATED';
        throw error;
    }

    return {
        id: member.id,
        name: member.name,
        role: member.role,
    };
}


export async function logout() {
    // Пока нужно уточнить ответственность этой функции
    throw new Error('Not implemented');
}
