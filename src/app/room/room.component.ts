// import { Component } from '@angular/core';
// import Peer from 'peerjs';

// @Component({
//   selector: 'app-room',
//   templateUrl: './room.component.html',
//   styleUrls: ['./room.component.css']
// })
// export class RoomComponent {
//   peer: Peer;
//   conn: any; // Assuming DataConnection is declared elsewhere in your code
//   recordedChunks: Blob[] = [];
//   mediaRecorder : any;
//   audioStream: MediaStream | undefined;
//   isConnectionRejected = false;

//   constructor() {
//       this.peer = new Peer();
//       // this.initializePeer();
//   }

//   getPeerId(): string {
//       return this.peer.id;
//   }

//   startRecording() {
//       navigator.mediaDevices
//           .getUserMedia({ audio: true })
//           .then((stream) => {
//               this.audioStream = stream;
//               this.mediaRecorder = new MediaStream();
//               this.mediaRecorder.ondataavailable = (e:any) => {
//                   this.recordedChunks.push(e.data);
//               };
//               this.mediaRecorder.start();
//           })
//           .catch((err) => {
//               console.log("The following error occurred: " + err);
//           });
//   }

//   stopRecording() {
//       if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
//           this.mediaRecorder.stop();
//           this.audioStream?.getTracks().forEach((track) => track.stop());
//           console.log("Recording stopped.");
//       } else {
//           console.log("No recording to stop.");
//       }
//   }

//   sendAudio() {
//       if (this.recordedChunks.length > 0) {
//           const audioBlob = new Blob(this.recordedChunks, { type: "audio/webm" });
//           this.appendMessage(audioBlob, true);
//           if (this.conn && this.conn.open) {
//               this.conn.send(audioBlob);
//               console.log("Audio sent.");
//           } else {
//               console.log("Connection not established or closed.");
//           }
//           this.recordedChunks = []; // Clear recorded chunks after sending
//       } else {
//           console.log("No audio to send.");
//       }
//   }

//   initializePeer() {
//       this.peer.on("open", (id:any) => {
//           console.log("My peer ID is: " + id);
//       });

//       this.peer.on("connection", (connection:any) => {
//           this.conn = connection;
//           console.log("Connected to peer: " + this.conn.peer);
//           const senderId = this.conn.peer;
//           this.showAcceptRejectButtons(true, senderId);
//           this.conn.on("data", (data:any) => {
//               this.appendMessage(data, false);
//           });
//       });
//   }

//   connectToPeer(peerId: string) {
//       this.conn = this.peer.connect(peerId);

//       this.conn.on("open", () => {
//           console.log("Connected to peer: " + this.conn.peer);
//           this.showAcceptRejectButtons(false);
//           this.conn.on("data", (data:any) => {
//               this.appendMessage(data, false);
//           });
//       });

//       this.conn.on("error", (err:any) => {
//           console.error("Error connecting to peer: " + err);
//       });
//   }

//   showAcceptRejectButtons(isReceiver: boolean, senderId?: string) {
//       console.log(isReceiver);
//       if (isReceiver) {
//           const acceptButton = document.createElement("button");
//           acceptButton.innerText = "Accept call from " + senderId;
//           acceptButton.onclick = () => this.acceptConnection(); // Fix here

//           const rejectButton = document.createElement("button");
//           rejectButton.innerText = "Reject";
//           rejectButton.onclick = () => this.rejectConnection(); // Fix here

//           const buttonsContainer = document.getElementById("buttons-container");
//           if (buttonsContainer) { // Check if the element is present
//               buttonsContainer.innerHTML = "";
//               buttonsContainer.appendChild(acceptButton);
//               buttonsContainer.appendChild(rejectButton);
//           }
//       }
//   }

//   acceptConnection() {
//       // Handle the logic when the connection is accepted
//       console.log("Connection accepted");
//       // Add your logic here
//   }

//   rejectConnection() {
//       // Handle the logic when the connection is rejected
//       console.log("Connection rejected");
//       this.isConnectionRejected = true;
//       alert("Connection rejected by the other user.");
//   }

//   sendMessage(message: string) {
//       if (this.isConnectionRejected) {
//           console.log("Cannot send messages, connection rejected.");
//           return;
//       }
//       if (message) {
//           this.appendMessage(message, true);
//           this.conn?.send(message); // Send text message
//       } else {
//           this.sendAudio(); // Send recorded audio if no text message is present
//       }
//   }

//   appendMessage(message: any, isMe: boolean) {
//       const talks = document.getElementById("talks");
//       const div = document.createElement("div");

//       if (message instanceof Blob && message.type.startsWith("audio")) {
//           // If the message is an audio Blob, create an audio element to play it
//           const audioElement = document.createElement("audio");
//           audioElement.controls = true;
//           audioElement.src = URL.createObjectURL(message);
//           div.appendChild(audioElement);
//       } else if (message instanceof ArrayBuffer) {
//           // If the message is an ArrayBuffer, convert it to Blob and create an audio element
//           const blob = new Blob([message], { type: "audio/wav" }); // Adjust MIME type as needed
//           const audioElement = document.createElement("audio");
//           audioElement.controls = true;
//           audioElement.src = URL.createObjectURL(blob);
//           div.appendChild(audioElement);
//       } else {
//           // If the message is text, display it as usual
//           div.innerText = message;
//       }

//       if (isMe) {
//           div.classList.add("me");
//       }

//       if (talks) { // Check if the element is present
//           talks.appendChild(div);
//       }
//   }
// }

import { Component } from '@angular/core';
import  Peer from 'peerjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent {
  peer: Peer;
  conn: any; // Assuming DataConnection is declared elsewhere in your code
  recordedChunks: Blob[] = [];
  mediaRecorder: any;
  audioStream: MediaStream | undefined;
  isConnectionRejected = false;
  peerId: string = '';

  constructor() {
    this.peer = new Peer();
  }

  getPeerId(): string {
    return this.peer.id;
  }

  startRecording() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.audioStream = stream;
        this.mediaRecorder = new MediaRecorder(this.audioStream);

        this.mediaRecorder.ondataavailable = (e: any) => {
          this.recordedChunks.push(e.data);
        };
        this.mediaRecorder.start();
      })
      .catch((err) => {
        console.log("The following error occurred: " + err);
      });
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.stop();
      this.audioStream?.getTracks().forEach((track) => track.stop());
      console.log("Recording stopped.");
    } else {
      console.log("No recording to stop.");
    }
  }

  sendMessage() {
    if (this.isConnectionRejected) {
      console.log("Cannot send messages, connection rejected.");
      return;
    }
    if (this.recordedChunks.length > 0) {
      const audioBlob = new Blob(this.recordedChunks, { type: "audio/webm" });
      this.appendMessage(audioBlob, true);
      if (this.conn && this.conn.open) {
        this.conn.send(audioBlob);
        console.log("Audio sent.");
      } else {
        console.log("Connection not established or closed.");
      }
      this.recordedChunks = []; // Clear recorded chunks after sending
    } else {
      console.log("No audio to send.");
    }
  }

  initializePeer() {
    const inputElement = document.getElementById('your_id') as HTMLInputElement;

    if (inputElement) {
        const yourId = inputElement.value; // Get the value from the input field
        console.log("Initializing with peer ID: " + yourId);

        this.peer = new Peer(yourId, { /* your Peer options here */ });

        this.peer.on('open', (id: any) => {
            console.log("My peer ID is: " + id);
        });

        this.peer.on("connection", (connection: any) => {
            this.conn = connection;
            console.log("Connected to peer: " + this.conn.peer);
            const senderId = this.conn.peer;
            this.showAcceptRejectButtons(true, senderId);
            this.conn.on("data", (data: any) => {
                this.appendMessage(data, false);
            });
        });
    } else {
        console.error("Element with ID 'your_id' not found");
    }
}




   connectToPeer() {

    if (this.peerId.trim() === '') {
      console.error('Peer ID cannot be empty');
      return;
    }
      this.conn = this.peer.connect(this.peerId);
 
      this.conn.on("open", () => {
          console.log("Connected to peer: " + this.conn.peer);
          this.showAcceptRejectButtons(false);
          this.conn.on("data", (data:any) => {
              this.appendMessage(data, false);
          });
      }); 

      this.conn.on("error", (err:any) => {
          console.error("Error connecting to peer: " + err);
      });
  }

  showAcceptRejectButtons(isReceiver: boolean, senderId?: string) {
    // Implement button creation logic here
  }

  acceptConnection() {
    // Implement logic when the connection is accepted
  }

  rejectConnection() {
    // Implement logic when the connection is rejected
  }

  appendMessage(message: any, isMe: boolean) {
          const talks = document.getElementById("talks");
          const div = document.createElement("div");
    
          if (message instanceof Blob && message.type.startsWith("audio")) {
              // If the message is an audio Blob, create an audio element to play it
              const audioElement = document.createElement("audio");
              audioElement.controls = true;
              audioElement.src = URL.createObjectURL(message);
              div.appendChild(audioElement);
          } else if (message instanceof ArrayBuffer) {
              // If the message is an ArrayBuffer, convert it to Blob and create an audio element
              const blob = new Blob([message], { type: "audio/wav" }); // Adjust MIME type as needed
              const audioElement = document.createElement("audio");
              audioElement.controls = true;
              audioElement.src = URL.createObjectURL(blob);
              div.appendChild(audioElement);
          } else {
              // If the message is text, display it as usual
              div.innerText = message;
          }
    
          if (isMe) {
              div.classList.add("me");
          }
    
          if (talks) { // Check if the element is present
              talks.appendChild(div);
          }
      }
}
