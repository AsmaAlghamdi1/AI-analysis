let menuIcon=document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");
let sections = document.querySelectorAll("section");
let navLink = document.querySelectorAll("header nav a");
// document.getElementById('start').addEventListener('click',()=>{
//     document.getElementById('blurBg').style.display='flex'
// });
// document.getElementById('close-btn').addEventListener('click',()=>{
//     document.getElementById('blurBg').style.display='none'
// });

window.onscroll = () => {
    sections.forEach(sec =>{
        let top= window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute("id");

        if(top >= offset && top < offset + height){
            navLink.forEach(links =>{
                links.classList.remove("active");
                document.querySelector("header nav a [href*="+id+"]").classList.add
                ("active")
            })
        }
    })
}

menuIcon.onclick = () =>{
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
}
document.addEventListener('DOMContentLoaded',function(){
    const start=document.getElementById('start');
    if(start){
        start.addEventListener('click',()=>{
            document.getElementById('blurBg').style.display='flex'
        });
        document.getElementById('close-btn').addEventListener('click',()=>{
            document.getElementById('blurBg').style.display='none'
        });
    }


//Send data from frontend to backend 

    const form=document.getElementById('contact-form');
    if(form){
        form.addEventListener('submit',async (e)=>{
            e.preventDefault();     
            let fullname = document.getElementById('full-name').value.trim();
            let email = document.getElementById('email').value.trim();
            let subject = document.getElementById('subject').value.trim();
            let message = document.getElementById('message').value.trim();
            
        await fetch("https://ai-analysis-4n6p.onrender.com/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ fullname, email, subject, message })
            })
            .then(res => res.json())
            .then(data => {
                console.log("Success:", data);
                alert("Your message has been successfully sent");
                form.reset();
            })
            .catch(err => {
                console.error("Error:", err);
                alert('Submission failed!');
            });
        });
    }

    document.getElementById("btn").addEventListener("click", (e) => {
    e.preventDefault(); 

    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    const prompt = "Please provide a comprehensive analysis of this UI design from a UX/UI perspective. Evaluate the color scheme, contrast, whitespace, typography, element spacing, icon sizing, layout alignment, and overall user experience. Highlight both strengths and weaknesses, and suggest specific, actionable improvements with clear reasoning for each point.";
    formData.append("prompt", prompt);

    fetch("https://ai-analysis-4n6p.onrender.com/analyze", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        document.querySelector(".analysis-UI").innerHTML = data.result;
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("حدث خطأ أثناء تحليل التصميم.");
      });
  });
    });
