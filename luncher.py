from flask import Flask
from flask import render_template
from flask import request
app = Flask(__name__)

from lib.foursquare import Foursquare, FoursquareAuth
import settings

client_id=settings.CLIENT_ID
client_secret=settings.CLIENT_SECRET
category_id=settings.CATEGORY_ID


@app.route('/', methods=['POST', 'GET'])
def index():
    auth=FoursquareAuth(client_id, client_secret)
    foursq=Foursquare(auth)
    venues=None
    error=None
    if request.method == 'POST':
        lat=request.form.get('lat', '')
        lon=request.form.get('lon', '')
        radius=request.form.get('radius', 500)
        cid=request.form.get('cid', category_id)
        latlon='%s.%s,%s.%s' % (lat.split('.')[0],
                                lat.split('.')[1][:2],
                                lon.split('.')[0],
                                lon.split('.')[1][:2],)
        try:
            res=foursq.request('venues', 
                                aspect='search', 
                                ll=latlon,
                                radius=radius,
                                categoryId=cid)
            venues=res['response']['venues']
        except Exception, e:
            error='Connection error - %s ' % e
    return render_template('base.html', venues=venues, error=error)
                                              
@app.route('/about')
def about():
    return 'About lunchlotto'

@app.route('/imprint')
def imprint():
    return 'Credits'

if __name__ == '__main__':
    app.run(debug=True)