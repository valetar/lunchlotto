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
    lat=''
    lon=''
    if request.method == 'POST':
        lat=request.form.get('lat', '')
        lon=request.form.get('lon', '')
        radius=request.form.get('radius', 500)
        cid=request.form.get('cid', category_id)
        latlon='%s.%s,%s.%s' % (lat.split('.')[0],
                                lat.split('.')[1],
                                lon.split('.')[0],
                                lon.split('.')[1],)
        try:
            res=foursq.request('venues', 
                                aspect='search', 
                                ll=latlon,
                                radius=radius,
                                categoryId=cid)
            venues=res['response']['venues']
        except Exception, e:
            error='Connection error - %s ' % e
    title='Where can I go for lunch today?'
    sitename='lunchlotto'
    return render_template('base.html', venues=venues, error=error, lat=lat, lon=lon, title=title, sitename=sitename)
                                              
@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/imprint')
def imprint():
    return render_template('imprint.html')

if __name__ == '__main__':
    app.run(debug=True)