var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",  //mysql server
    user: "root",   // mysql username
    password: "",  // mysql password
    database: "billservice" // mysql database name
});

con.connect((err) => {
    if (err) {
        console.log(err);
        throw err;
    }
});

var express = require('express');
var app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");  
    res.setHeader("Access-Control-Allow-Headers",    "Origin, X-Requested-With, Content-Type, Accept"  );  
    res.setHeader("Access-Control-Allow-Methods",    "GET, POST, PATCH, PUT, DELETE, OPTIONS"  );  
    next();
  });

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded

app.post("/bill",(req,res)=>{
    const billData=req.body;
    console.log(billData);
    const q1="insert into bill_details(cname,mobile_no,bill_date,bill_amt) values(?,?,?,?)";
    const d1=[billData.customerName,billData.contact,billData.billDate,billData.billAmt];
    const q2="insert into item_details(sno,name,price,qty,bill_no) values ?";
    con.query(q1,d1,(err,result)=>{
        if (err){
            res.send({status:'FAIL',message:err.sqlMessage});
        }else{
            const billNo=result.insertId;
            const d2=[];
            for(let item of billData.items){
               d2.push([item.itemNo,item.name,item.price,item.qty,billNo]); 
                }
                con.query(q2,[d2],(err,result)=>{
                    if(err){
                        res.send({status:'FAIL',message:err.sqlMessage});
                    }
                    console.log(result.affectedRows);
                    res.send({status:"SUCCESS",message:{billno:billNo}});
                });
            }        
    })  
});

app.get("/bill/:billNo",(req,res)=>{
    const billNo=req.params['billNo'];
    con.query("select * from bill_details where bill_no=?",[billNo],(err,response)=>{
        if(err){
            res.send({status:'FAIL',message:err.sqlMessage});
        }

        if(response && response.length>0){
            const data=response[0];
            const bill={};
            bill.billNo=data.bill_no;
            bill.customerName=data.cname;
            bill.billDate=data.bill_date;
            bill.contact=data.mobile_no;
            bill.billAmt=data.bill_amt;
            con.query("select * from item_details where bill_no=?",[billNo],(err,response)=>{
                console.log(billNo);
                if(response && response.length>0){
                    const items=[];
                    for(let row of response){
                        const item={};
                        item.itemNo=row.sno;
                        item.name=row.name;
                        item.price=row.price;
                        item.qty=row.qty;
                        items.push(item);
                    }
                    bill.items=items;                 
                    res.send({status:'SUCCESS',message:'data found',data:bill});
                }
            })
        }else{
            res.send({status:'FAIL',message:'No Data Found'}); 
        }       
    });   
});

app.listen(3000, function () {
    console.log('listening on 3000');
});