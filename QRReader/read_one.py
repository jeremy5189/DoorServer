#!/usr/bin/python
from subprocess import call
import zbar
import sys, signal
import unirest
import hashlib
import json
import time

# initialize the Processor
device = '/dev/video0'
url = 'http://192.168.10.131:8000'

preview = False
if len(sys.argv) > 1:
	preview = True

# create a Processor
proc = zbar.Processor()

# configure the Processor
proc.parse_config('enable')

proc.init(device)


while True:

	# enable the preview window
	if (preview):
		proc.visible = True

	# read at least one barcode (or until window closed)
	print 'Waiting for QR Code...'
	proc.process_one()

	# hide the preview window
	if (preview):
		proc.visible = False

	# extract results
	for symbol in proc.results:
		
		# do something useful with results
		print 'decoded', symbol.type, 'symbol', '"%s"' % symbol.data

		# Send HTTP Request
		response = unirest.get(url + "/api/query", headers={}, params={ "qr_code": symbol.data, "checksum": hashlib.sha1('GoodWeb'+ symbol.data).hexdigest()})
	
		print 'API RESP'
		print response.body
		print response.body['status']

		if response.body['status']:

			print 'Trigger Door Lock'

			# Unlock
			door = unirest.get('http://localhost:3000/unlock', headers={}, params={})

			time.sleep(3)

			door = unirest.get('http://localhost:3000/lock', headers={}, params={})

		else:

			call(["aplay", "/home/pi/pifm/sound.wav"])
