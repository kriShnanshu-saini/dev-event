// lib/constants.ts

export interface Event {
    title: string;
    image: string;
    location: string;
    slug: string;
    date: string;
    time: string;
}

export const events: Event[] = [
    {
        title: "Google I/O Extended India 2025",
        image: "/images/event1.png",
        location: "Bengaluru, India",
        slug: "google-io-extended-india-2025",
        date: "April 20, 2025",
        time: "10:00 AM – 5:00 PM",
    },
    {
        title: "JSConf Asia",
        image: "/images/event2.png",
        location: "Singapore",
        slug: "jsconf-asia-2025",
        date: "June 6, 2025",
        time: "9:00 AM – 6:00 PM",
    },
    {
        title: "React India Conference",
        image: "/images/event3.png",
        location: "Goa, India",
        slug: "react-india-conference-2025",
        date: "September 12, 2025",
        time: "9:30 AM – 6:30 PM",
    },
    {
        title: "ETHGlobal Hackathon",
        image: "/images/event4.png",
        location: "Online / Global",
        slug: "ethglobal-hackathon-2025",
        date: "August 2, 2025",
        time: "48 Hours",
    },
    {
        title: "AWS Community Day India",
        image: "/images/event5.png",
        location: "Hyderabad, India",
        slug: "aws-community-day-india-2025",
        date: "July 19, 2025",
        time: "10:00 AM – 6:00 PM",
    },
    {
        title: "Microsoft Build Developer Meetup",
        image: "/images/event6.png",
        location: "Seattle, USA",
        slug: "microsoft-build-meetup-2025",
        date: "May 21, 2025",
        time: "9:00 AM – 5:00 PM",
    },
];
