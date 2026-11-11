import Member from '../models/member.model.js';

export async function findById(memberId) {
    return Member.findById(memberId).select('name role').exec();
}

export async function findAllMembers() {
    return Member.find().select('_id name').sort({ name: 1 }).lean().exec();
}
