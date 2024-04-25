const telegramAuthToken =`6354199649:AAEc2FY0Zaguc0H62fNmpMEDHnENd-QhBSQ`;
const webhookEndpoint = "/endpoint";
addEventListener ("fetch",event=>{
  event.respondWith(handleIncomingRequest(event));
});

async function handleIncomingRequest(event) {
  let url = new URL(event.request.url);
  let path = url.pathname;
  let method = event.request.method;
  let workerUrl = `${url.protocol}//${url.host}`;

  if(method === "POST" && path === webhookEndpoint) {
    const update = await event.request.json();
    event.waitUntil(processUpdate(update));
    return new Response("Ok");
  } else if(method === "GET" && path === "/configure-webhook") {
    const url = `https://api.telegram.org/bot${telegramAuthToken}/setWebhook?url=${workerUrl}${webhookEndpoint}`;

    const response = await fetch(url);

    if(response.ok) {
      return new Response("Webhook set successfully",{status:200});
    } else {
      return new Response("Failed to set webhook",{status:response.status});
    }
  } else {
    return new Response("Not found",{status:404});
  }

}

async function processUpdate(update) {
  if("message" in update) {
    const chatId = update.message.chat.id;
    const userText = update.message.text;

    const responseText =`You said: ${userText}`;

    const url = `https://api.telegram.org/bot${telegramAuthToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(responseText)}`;

    await fetch(url);
  }
}
