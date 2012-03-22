from flask import Flask
app = Flask(__name__)

@app.route('/')
def index():
    return 'Where can I go for lunch today?'

@app.route('/about')
def about():
    return 'About lunchlotto'

@app.route('/imprint')
def imprint():
    return 'Credits'

if __name__ == '__main__':
    app.run()