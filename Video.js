const mongoose = require('mongoose');

// Schéma pour les vidéos
const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    videoUrl: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    isSponsored: {
        type: Boolean,
        default: false // Indique si la vidéo est sponsorisée
    },
    sponsorInfo: {
        sponsorName: {
            type: String,
            default: ''
        },
        sponsorLink: {
            type: String,
            default: ''
        },
        sponsorPaidAmount: {
            type: Number,
            default: 0 // Montant payé par le sponsor pour la vidéo
        }
    },
    liveStream: {
        type: Boolean,
        default: false // Indique si c'est une vidéo en direct (live streaming)
    },
    liveStreamEndTime: {
        type: Date,
        default: null // Date de fin pour les vidéos live
    },
    earningsPerThousandViews: {
        type: Number,
        default: 3.00 // 3 euros pour 1000 vues par défaut, modifiable
    },
    earnings: {
        type: Number,
        default: 0 // Total des gains de la vidéo
    },
    status: {
        type: String,
        enum: ['published', 'draft', 'removed'],
        default: 'draft' // Statut de la vidéo
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Méthode pour calculer les gains de la vidéo
videoSchema.methods.calculateEarnings = function () {
    this.earnings = (this.views / 1000) * this.earningsPerThousandViews;
    return this.earnings;
};

// Middleware pour mettre à jour les gains à chaque vue
videoSchema.methods.incrementViews = function () {
    this.views += 1;
    this.calculateEarnings();
    return this.save();
};

// Middleware pour mettre à jour les likes/dislikes
videoSchema.methods.toggleLike = function (userId) {
    const index = this.likes.indexOf(userId);
    if (index === -1) {
        this.likes.push(userId);
    } else {
        this.likes.splice(index, 1);
    }
    return this.save();
};

videoSchema.methods.toggleDislike = function (userId) {
    const index = this.dislikes.indexOf(userId);
    if (index === -1) {
        this.dislikes.push(userId);
    } else {
        this.dislikes.splice(index, 1);
    }
    return this.save();
};

// Middleware pour mettre à jour la date de modification
videoSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Modèle Video
const Video = mongoose.model('Video', videoSchema);

module.exports = Video;