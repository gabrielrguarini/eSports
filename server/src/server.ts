import express from "express";
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { convertHourToStringMinutes } from './utils/convert-hour-to-string-minutes'
import { convertMinutesToHourString } from "./utils/convert-minutes-to-hour-string";


const app = express();
app.use(express.json())
app.use(cors())

const prisma = new PrismaClient({
    log: ['query']
});

app.get("/games",async (req,res)=>{
    const games = await prisma.game.findMany({
        include: {
            _count:{
                select:{
                    ads:true
                }
            }
        }
    })
    return res.json(games)

})
app.post("/games/:id/ads", async (req,res)=>{
    const gameId = req.params.id;
    const body: any = req.body


    const ad = await prisma.ad.create({
        data:{
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord:body.discord,
            weekdDays: body.weekdDays.join(','),
            hourStart: convertHourToStringMinutes(body.hourStart),
            hourEnd: convertHourToStringMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel
        }
    })
    return res.status(201).json(ad);
})

app.get("/games/:id/ads", async(req, res) => { 
    const gameId = req.params.id;
    const ads = await prisma.ad.findMany({
        select:{
            id: true,
            name: true,
            weekdDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,
        },
        where:{
            gameId:gameId
        },
        orderBy:{
            createdAt: 'desc'
        }
    })
    return res.json(ads.map(ad =>{
        return {
            ...ad,
            weekdDays: ad.weekdDays.split(','),
            hourStart: convertMinutesToHourString(ad.hourStart),
            hourEnd: convertMinutesToHourString(ad.hourEnd)
        }
    }))
});
app.get("/ads/:id/discord", async(req, res) => {
    const adId = req.params.id;
    const ad = await prisma.ad.findUniqueOrThrow({
        select:{
            discord: true
        },
        where:{
            id: adId
        }
    });
    return res.json({
        gabriel:'asd',
        discord: ad.discord
    })
});

app.listen(3333); 
