from flask import Flask
from flask import render_template
app = Flask(__name__)

@app.route('/')
def index(title='Lunchlotto - Where should I go for lunch today?'):
    return render_template('base.html', title=title)

@app.route('/about')
def about():
    return 'About lunchlotto'

@app.route('/imprint')
def imprint():
    return 'Credits'

if __name__ == '__main__':
    app.run()