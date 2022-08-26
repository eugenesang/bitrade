const {writeFileSync}= require('fs');
const day1=new Date("Jul 3 2021");

class Investment{
 constructor(amount, rate, days, startDay){
    
    this.dailyInput= +(amount*.05).toFixed(2);
    this.amount= +amount.toFixed(2);
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
            moneyIn+=i.alive? i.dailyInput:0;
        }
        let day=new Date('Jul 03 2022').setDate(day1.getDate()+this.day);
        this.days.push({day:new Date(day).toDateString(), moneyIn:+moneyIn.toFixed(2), total:+this.total.toFixed(2)})
        this.reinvest();
        return this.total;
    }
    reinvest(){
        if(this.total <25) return ;
        this.investmets.push(new Investment(this.total, 1.5, 30, this.day));
        this.total=0;
    }
    withdraw(){
        
        let d=30;
        while(d>0){
            d--;
            this.day++;
            let moneyIn=0;
            for(let i of this.investmets){
                this.total+= +i.nextDay();
                moneyIn+=i.alive? +i.dailyInput:0;
            }
            let day=new Date('Jul 03 2022').setDate(day1.getDate()+this.day);
            this.days.push({day:new Date(day).toDateString(), moneyIn:+moneyIn.toFixed(2), total:+this.total.toFixed(2)})
        }
        this.total=+this.total.toFixed(2);
        return this.total;
    }
}
let a=new Investment(27, 1.5, 30, 0);
let day=new Calender();
day.investmets.push(a);
for(let i =0; i<161; i++){
    day.nextDay();
}
day.withdraw()
for(let e of day.investmets){
    e.dailyInput=e.dailyInput.toFixed(2);
    e.amount=e.amount.toFixed(2);
}

console.log(day1.toDateString());

writeFileSync('money.json', JSON.stringify(day, null, 2));
