const { response } = require("express");
const Event = require("../models/event");



const getEvents = async (req, res = response) => {
    
  const events = await Event.find()
                            .populate('user','name');

     res.json({
       ok: true,
       events
     });
   };

   const createEvent = async(req, res = response) => {
    
    const event=new Event(req.body);
    try {
      event.user=req.uid;
      const eventoGuardado = await event.save();
      res.status(201).json({
        ok: true,
        evento:eventoGuardado
      });

    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Por favor hable con el admnistrador",
      });
    }
  };

  const updateEvent = async(req, res = response) => {
    
    const eventId = req.params.id;
    const uid = req.uid;
    try {
      const event = await Event.findById(eventId);
      if(!event){
        return res.status(404).json({
          ok: false,
          msg: "El evento no existe con ese id ",
        });
      }
      if(event.user.toString() !== uid){
       return res.status(401).json({
          ok: false,
          msg: "No tiene privilegios de editar este evento ",
        });
      }
      const nuevoEvento = {
        ...req.body,
        user:uid
      }
      const eventoActualizado = await Event.findByIdAndUpdate(eventId,nuevoEvento,{new:true});
      res.status(200).json({
        ok: true,
        evento:eventoActualizado
      });

    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Por favor hable con el admnistrador",
      });
    }
  };
  const deleteEvent = async(req, res = response) => {
    
    const eventId = req.params.id;
    const uid = req.uid;
    try {
      const event = await Event.findById(eventId);
      if(!event){
      return  res.status(404).json({
          ok: false,
          msg: "El evento no existe con ese id ",
        });
      }
      if(event.user.toString() !== uid){
       return res.status(401).json({
          ok: false,
          msg: "No tiene privilegios de eliminar este evento ",
        });
      }
     
    await Event.findByIdAndDelete(eventId);
      res.status(200).json({
        ok: true
      });

    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Por favor hable con el admnistrador",
      });
    }
  };


  module.exports={
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
  }