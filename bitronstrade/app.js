class Investment{
 constructor(amount, rate, days, startDay){
    
    this.dailyInput=(amount*.05);
    this.amount=amount;
    this.rate=rate;
    this.days=days;
    this.givenDays=0;
    this.remainingDays=days;
    this.alive=true;
    this.startDay=startDay;
    this.endDay=startDay+30;
};
nextDay(){
    if(this.remainingDays<1 || !this.alive){
        this.alive=false
        return 0;
    };
    this.givenDays++;
    this.remainingDays--;
    if(this.remainingDays < 1) this.alive=false;
    return this.dailyInput;
}

}

class Calender{
    constructor(){
        this.investmets=[];
        this.day=0;
        this.days=[];
        this.total=0;
    }
    nextDay(){
        this.day++;
        let moneyIn=0;
        for(let i of this.investmets){
            this.total+=i.nextDay();
            moneyIn+=i.dailyInput;
        }
        this.days.push({day:this.day, moneyIn:moneyIn.toFixed(2), total:this.total.toFixed(2)})
        this.reinvest();
        return this;
    }
    reinvest(){
        if(this.total <25) return ;
        this.investmets.push(new Investment(this.total, 1.5, 30, this.day));
        this.total=0;
    }
    withdraw(){
        let bal=this.total;
        for(let inv of this.investmets){
            bal+= inv.remainingDays*inv.dailyInput;
            inv.remainingDays=0;
            inv.alive=false;
        }
        this.day+=30;
        return bal;
    }
}
let a=new Investment(27, 1.5, 30, 0);
let day=new Calender();
day.investmets.push(a);
for(let i =0; i<151; i++){
    day.nextDay();
}
for(let e of day.investmets){
    e.dailyInput=e.dailyInput.toFixed(2);
    e.amount=e.amount.toFixed(2);
}

console.log(day.withdraw());
const {writeFileSync}= require('fs');
writeFileSync('money.json', JSON.stringify(day, null, 2));