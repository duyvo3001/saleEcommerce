import { NotificationSchemaModels } from './../models/notification.model';

export class notificationService {
    static async pushNotiToSystem({ type, revicedId, senderId, options }: any) {
        let noti_content = ""

        if (type === "SHOP-001") {
            noti_content = "@@@ vua them vao san pham : @@@"
        } else if (type === "PROMOTION-001") {
            noti_content = "@@@ vua them vao 1 voucher : @@@"
        }

        const newNoti = await NotificationSchemaModels.create({
            noti_type: type,
            noti_senderId: senderId,
            noti_receivedId: revicedId,
            noti_content,
            noti_options: options
        })

        return newNoti
    }

    static async listNotiByUser({ userId, type, isRead }: any) {
        const match: any = { noti_receivedId: userId }

        if (type !== "ALL") {
            match['noti_type'] = type
        }

        return await NotificationSchemaModels.aggregate([
            {
                $match: match
            },
            {
                $project: {
                    noti_type: 1,
                    noti_senderId: 1,
                    noti_receivedId: 1,
                    noti_content: 1,
                    createAt: 1
                }
            }
        ])
    }
}