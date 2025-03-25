let cou=100

while(cou){
    try{
        const res = await fetch("https://kashi-bnb-production.up.railway.app/");
        const stream = res.body.pipeThrough(new TextDecoderStream());
        for await (const val of stream){
            console.log(val);
        }
    }
    catch(e){
        console.log(e);
        break;
    }
    cou--;
}