const express = require('express');
const router = express.Router();
const mongoose=require('mongoose');
const Events= require('../models/event');


router.get('/',(req,res,next)=>{
    Events.find()
    .select()
    .populate()
    .exec()
    .then(docs=>{
        console.log(docs);
        res.status(200).json({
            count:docs.length,
            orders:docs.map(doc=>{
                return{
                    _id:doc._id,
                    client:doc.client,
                    driver:doc.driver,
                    driver_status:doc.driver_status
                }
            })
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

router.post('/',(req,res,next)=>{
    const event=new Events({
        _id:mongoose.Types.ObjectId(),
        client:req.body.client,
        driver:req.body.driver,
        driver_status:req.body.driver_status
    });
    event.save().then(result=>{
        console.log(result);

        res.status(201).json({
            message:'Created new event',
            created_event:{
                client:result.client,
                driver:result.driver,
                driver_status:result.driver_status,
                _id:result._id
            }
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
    
});

router.delete('/:event_Id',(req,res,next)=>{
    const id=req.params.event_Id;
    Events.remove({_id:id})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

router.patch('/:event_Id',(req,res,next)=>{
    const id=req.params.event_Id;
    const updateOps={};
    for (const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Events.update({_id:id},{$set:updateOps})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
})


module.exports =router;
