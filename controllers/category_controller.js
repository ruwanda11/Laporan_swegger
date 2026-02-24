const Category = require('../models/category');
const { validationResult } = require('express-validator');

exports.getAll = async(req,res)=>{
    const data = await Category.getAll();
    res.json(data.rows);
};

exports.create = async(req,res)=>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json(errors.array());
    }

    const {nama} = req.body;

    await Category.create(nama);

    res.json({
        message:"Category berhasil dibuat"
    });

};

exports.update = async(req,res)=>{

    const {id} = req.params;
    const {nama} = req.body;

    await Category.update(id,nama);

    res.json({
        message:"Category berhasil diupdate"
    });

};

exports.delete = async(req,res)=>{

    const {id} = req.params;

    await Category.delete(id);

    res.json({
        message:"Category berhasil dihapus"
    });

};