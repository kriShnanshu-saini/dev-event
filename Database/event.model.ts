import {Document, model, models, Schema} from 'mongoose';

// TypeScript interface for event model
export interface IEvent extends Document {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        overview: {
            type: String,
            required: [true, 'Overview is required'],
            trim: true,
            maxlength: [1000, 'Overview cannot exceed 1000 characters'],
        },
        image: {
            type: String,
            required: [true, 'Image URL is required'],
            trim: true,
        },
        venue: {
            type: String,
            required: [true, 'Venue is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        date: {
            type: String,
            required: [true, 'Date is required'],
        },
        time: {
            type: String,
            required: [true, 'Time is required'],
        },
        mode: {
            type: String,
            required: [true, 'Mode is required'],
            enum: {
                values: ['online', 'offline', 'hybrid'],
                message: 'Mode must be either online, offline or hybrid',
            }
        },
        audience: {
            type: String,
            required: [true, 'Audience is required'],
            trim: true,
        },
        agenda: {
            type: [String],
            required: [true, 'Agenda is required'],
            validate: {
                validator: (value: string[]) => value.length > 0,
                message: 'At least one agenda is required',
            }
        },
        organizer: {
            type: String,
            required: [true, 'Organizer is required'],
            trim: true,
        },
        tags: {
            type: [String],
            required: [true, 'Tags are required'],
            validate: {
                validator: (value: string[]) => value.length > 0,
                message: 'At least one tag is required',
            }
        }
    },
    {timestamps: true}
);

// pre-save hook for slug-generation and data normalization
EventSchema.pre('save', function () {
    const event = this as IEvent;

    // generate slug only if title changed or document is new
    if (event.isModified('title') || event.isNew) {
        event.slug = generateSlug(event.title);
    }

    // normalize date to ISO format if not
    if (event.isModified('date')) {
        event.date = normalizeDate(event.date);
    }

    // normalize time format (HH:mm)
    if (event.isModified('time')) {
        event.time = normalizeTime(event.time);
    }
});


/*
 * Helper methods
*/
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')   // remove special characters
        .replace(/\s+/g, '-')           // replace spaces with hyphens
        .replace(/-+/g, '-');            // collapse multiple hyphens
}

function normalizeDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
    }

    return date.toISOString().split('T')[0]; // return YYYY-MM-DD format
}

function normalizeTime(timeString: string): string {
    // handle various time formats and convert to HH:mm (24h format)
    const timeRegex = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i;
    const match = timeString.trim().match(timeRegex);

    if (!match) {
        throw new Error('Invalid time format. Use HH:MM or HH:MM AM/PM');
    }

    let hours = parseInt(match[1]);
    const minutes = match[2] || '00';
    const period = match[3]?.toUpperCase();

    if (period) {
        // convert 12h to 24h format
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
    }

    if (hours < 0 || hours > 23 || parseInt(minutes) > 59) {
        throw new Error('Invalid time values');
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}


// create unique index n slug for better performance
EventSchema.index({slug: 1}, {unique: true});

// create compound index for common queries
EventSchema.index({date: 1, mode: 1});

const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;