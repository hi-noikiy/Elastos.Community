import * as _ from 'lodash';

export default class Base {
    protected db;
    private session;
    protected currentUser;

    constructor(db, session){
        this.db = db;
        this.session = session;
        this.currentUser = session.user;

        this.init();
    }

    protected init(){}

    public getDBModel(name: string){
        return this.db.getModel(name);
    }

    protected getService<T extends Base>(service: { new(...args): T }): T{
        return new service(this.db, this.session);
    }

    protected async markLastSeenComment(commentable, createdBy, db_commentable) {
        if (commentable.comments && commentable.comments.length) {
            const subscriberInfo = _.find(commentable.subscribers, (subscriber) => {
                return subscriber.user && subscriber.user._id.toString() === this.currentUser._id.toString()
            })

            if (subscriberInfo) {
                subscriberInfo.lastSeen = new Date()
            } else if (createdBy._id.toString() === this.currentUser._id.toString()) {
                commentable.lastCommentSeenByOwner = new Date()
            }

            await db_commentable.update({_id: commentable._id}, {
                subscribers: commentable.subscribers,
                lastCommentSeenByOwner: commentable.lastCommentSeenByOwner
            })
        }
    }
}