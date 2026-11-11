import * as memberService from '../service/member.service.js';

export async function getMembers(req, res, next) {
    try {
        const members = await memberService.getMembers();
        return res.status(200).json(members);
    } catch (error) {
        return next(error);
    }
}
