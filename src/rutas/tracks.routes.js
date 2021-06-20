const {Router}=require('express');
const router=Router();

const {getTrack, guardarTrack}=require('../control/tracks.contro')
//metodo para mostar la cancion
router.get('/tracks/:trackID',getTrack);
//metodo para guardar la cancion
router.post('/tracks',guardarTrack);

module.exports=router;