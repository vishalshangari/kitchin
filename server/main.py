import time
from flask import Flask

app = Flask(__name__)

@app.route("/time")
def home():
    return {'time': time.time(), 'text': 'Hello from the bacteasdfadskend API'}
  
if __name__ == "__main__":
    app.run()

