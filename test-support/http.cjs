const {spawn}=require('node:child_process'), assert=require('node:assert/strict'),net=require('node:net');
const path=require('node:path');const dir=path.resolve(__dirname,'..');const child=[];
(async()=>{try{
 await new Promise((resolve,reject)=>{const s=net.createServer();s.once('error',reject);s.listen(6379,'127.0.0.1',()=>s.close(resolve))});
 const redis=spawn(process.env.REDIS_SERVER_BIN || 'redis-server',['--bind','127.0.0.1','--port','6379','--save','','--appendonly','no'],{cwd:'/tmp'});child.push(redis);let redisout='';redis.stdout.on('data',b=>redisout+=b);redis.stderr.on('data',b=>redisout+=b);redis.on('error',e=>redisout+=e.message);
 for(let i=0;i<40;i++){if(redisout.includes('Ready to accept connections'))break;await new Promise(r=>setTimeout(r,50))}assert.match(redisout,/Ready to accept connections/);
 const app=spawn(process.execPath,['--require',path.join(__dirname,'docker-dns.cjs'),'index.js'],{cwd:dir});child.push(app);let out='';app.stdout.on('data',b=>out+=b);app.stderr.on('data',b=>out+=b);for(let i=0;i<40;i++){if(out.includes('Server is running'))break;await new Promise(r=>setTimeout(r,50))}assert.match(out,/Server is running/);
 for(let n=1;n<=5;n++){const r=await fetch('http://127.0.0.1:8081/');assert.equal(r.status,200);assert.equal(await r.text(),'Number of visits: '+n)}
 const store=spawn(process.env.REDIS_CLI_BIN || 'redis-cli',['-p','6379','get','visits']);let value='';store.stdout.on('data',b=>value+=b);store.on('error',e=>{value=e.message});await new Promise(r=>store.on('exit',r));assert.equal(value.trim(),'6');assert.equal((await fetch('http://127.0.0.1:8081/missing')).status,404);console.log('PASS real Redis + HTTP: five sequential visits1..5, persisted counter6, 404. DNS-only external alias for Docker service hostname.');
 }finally{for(const c of child.reverse()){c.kill();if(c.exitCode===null)await new Promise(r=>c.on('exit',r))}}
})().catch(e=>{console.error(e);process.exitCode=1});
