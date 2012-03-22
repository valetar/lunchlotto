#!/usr/bin/env python
#Copyright 2010-2011 Alexander Valet <valetar@googlemail.com>
#
#Licensed under the Apache License, Version 2.0 (the "License");
#you may not use this file except in compliance with the License.
#You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
#Unless required by applicable law or agreed to in writing, software
#distributed under the License is distributed on an "AS IS" BASIS,
#WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#See the License for the specific language governing permissions and
#limitations under the License.
#

try:
    import json
except ImportError:
    import simplejson as json
import urllib
import urllib2

# Default API version
API_VERSION = u'20111215'

# API Endpoints
API_ENDPOINT = u'https://api.foursquare.com/v2'
AUTH_ENDPOINT = u'https://foursquare.com/oauth2/authenticate'
TOKEN_ENDPOINT = u'https://foursquare.com/oauth2/access_token'


class FoursquareAuth(object):
    """foursquare OAuth authentication
    
    """
    def __init__(self, client_id, client_secret, redirect_uri=None, access_token=None):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        self.access_token = access_token

    def get_auth_redirect(self):
        """Return redirect URI to authenticate a user with foursquare
        
        """
        uri = '%s?client_id=%s&response_type=code&redirect_uri=%s' % (AUTH_ENDPOINT, 
                                                                      self.client_id,
                                                                      self.redirect_uri)
                                                                      
        return uri    

    def get_auth_token(self, code):
        """Get access token with code from foursquare
        
        """
        url = '%s?client_id=%s&client_secret=%s&grant_type=authorization_code&code=%s' % (
                                                            TOKEN_ENDPOINT, self.client_id, self.client_secret, code
                                                            )
        self.access_token = json.load(urllib2.urlopen(url))
        
        return self.access_token


class Foursquare(object):
    """foursquare API wrapper
    
    """
    def __init__(self, auth, version=API_VERSION):
        """Sets up the api object with an auth object
		
		"""
        self.client_id = auth.client_id
        self.client_secret = auth.client_secret
        self.access_token = auth.access_token
        self.version = version
        
        self.response = None
	
    def request(self, resource, resource_id=None, aspect=None, action=None, **kwargs):
        try:
            if self.access_token:
                kwargs.update({'oauth_token':self.access_token, 'v':self.version})
            else:
                kwargs.update({'client_id':self.client_id,
                               'client_secret':self.client_secret,
                               'v':self.version})
            url = API_ENDPOINT
            for param in (resource, resource_id, aspect, action):
                if param:
                    url += '/%s' % param
            url = '%s?%s' % (url, urllib.urlencode(kwargs)) 
            self.response = json.load(urllib2.urlopen(url))
            return self.response
        except Exception, e:
            raise FoursquareException(e)


class FoursquareException(Exception):
    def __init__(self, msg):
        self.args = (msg,)
        self.errormsg = msg
