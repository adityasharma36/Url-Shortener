

const base62Digits = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
export function toBase62(num:number):string{
    if(num===0) return "";
    let base62 ='';
    while(num>0){
        let remainder = num%62;

        base62+=(base62Digits[remainder]);
        num = Math.floor(num/62);
    }
    return base62;
}
export function fromBase62(str:string):number{

    let result = 0;

    if(str === '') return 0;

    for(let i = 0;i<str.length;i++){

        let char  = str[i];

        if(char ===  undefined) return 0;

        const index = base62Digits.indexOf(char);

        result = result * 62 + index;

    }

    return result;
    
}


