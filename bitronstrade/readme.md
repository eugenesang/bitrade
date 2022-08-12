# Bitronstrade
https://bitronstrade.com is a platform where you can invest your crypto let some marketing experts trade the coins for you then after some period you get
your returns with some intrest.

There are differnt investment plans but Ill go with the cheapest one.

### Standard plan
* 5.00% everyday
* For 30 days
* $25 - $1000

As long as you have an amount ` > 25 `, you can reinvest

Multiple investments can be running in parallel ie you can have a $26 investment runnning as well as a $500 one

The way I do it to get the most profit within the shortest time is to reinvest as long as the balance is greater than $25

In my case I started with $27 in the standard plan

The rate is `0.05` per day for `30 days`

The daily returns is `27 * .05` which is $`1.35`

I wait until it's above `$25` so that I can re-invest

After `19 days` the amount is `$25.65` then we reinvest everything

Now we have our second `investment` running while our first is still alive

Now at the 19th day the investments are such that
```js
const investments=[
{deposit:27, dailyInput: 1.35, remainingDays: 11},
{deposit:25.65, dailyInput: 1.28, remainingDays:30}
]
```
And the daily data is
```js
const day19={
dailyInput:2.63, //sum of all `dailyInput` from all the investments 
accBalance:0,
day:19
}
```
Remember that the total account balance at day 19 will be `$0` because all the  ballance has been put back to the investments

From these data we can already begin to model our investments class
## Investments 
It has the following features
* It's dead if the remaining days is 0
* It has daily input which is basically `amount*rate/days` 
>> `rate = 1.5`
>
>> ` days = 30`
>
>> ` dailyInput` is `amount * 1.5 / 30` or ` amount* 0.05`
* The start day will be crucial especially in the callender
* Finally we have a function that moves from one day to another
```js
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
    //Check if there are remaining days, kill it if there is none
    //Also check if it's alive, stop if it's not
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
```
A day can also have the following
* Alive investments 
* Total amount streaming in from the alive investments
* Overall sum of money in the account
* We can check if account balance is eligible for a reinvestment

My goal at this point is to make a callender to show me the days that I will be reinvesting

The idea of having information about each day is just an additional feature

We will instead create a callender which will have
* A store for all the investments
* A store for all days passed
* Total ballance at the time of stoppage
* The current day
It also needs to do the following
* Shift to the next day, which will 
  > record the information of the current day in the day's store
  > Calculate the total ballance of the day
  > Call the re invest function 
* Reinvest which will check the ballance and continue if it's enough for reinvestment 
* Withdraw will move to the next day without reinvesting, you can only withdraw 30 days earlier than the actual withdrawal day because it will take at least 30 days for the latest investment to complete
```js
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
```
After all that we set up our ` objects ` from the classes we have made

We run the investments for the preferred time and then withdraw.

There is a bug I can't fix that can't allow me to represent my numbers in `two decimal places` considering we are handling money

That's why I formatted the investments and day's data

We then print the output in a JSON file which will be used to make a readable table or template callender
