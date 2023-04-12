const Expence = require('../model/expence');

exports.getAllExpence = (req, res, next) => {
    Expence.findAll()
    .then(expence => {
        res.json(expence);
    })
    .catch(err => console.log(err));
}

exports.postExpence = async (req, res, next) => {
    try{
        console.log(req.body.amt, req.body.desp, req.body.expence);
        const data = await Expence.create({
             amount: req.body.amount,
             description: req.body.description,
             category: req.body.category
        });
        res.status(200).json({newExpence: data});
    }catch(err) {
        console.log(err);
        res.status(500).json({error: err});
    }
}

exports.deleteExpence = (req, res, next) => {
    const eId = req.params.id;
    console.log('it all parameters   '+req.params);
    Expence.destroy({where: {id: eId}})
    .then(expence => {
        console.log(expence);
        console.log('delete successs');
        res.sendStatus(200);
    })
    .catch(err => console.log(err));
}