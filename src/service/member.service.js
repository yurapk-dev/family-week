import * as memberRepository from '../repositories/member.repository.js';

export async function getMembers() {
    const members = await memberRepository.findAllMembers();

    return members.map(member => ({
        id: member._id.toString(),
        name: member.name,
    }));
}
