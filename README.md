# omniembed

Single oEmbed endpoint for various services, sometimes enhancing the oEmbed endpoints provided by the services themselves.

## Services

* YouTube
    - adds description
    - uses largest possible thumbnail URL/size
* more to come!

To request oEmbed data, do a request to

http://omniembed.herokuapp.com/v1.json?url=http://www.youtube.com/watch?v=AU8ITJ3YG54

where `URL` is the encoded URL of the media item.  For example, to get information for http://www.youtube.com/watch?v=AU8ITJ3YG54, you would request

http://omniembed.herokuapp.com/v1.json?url=http%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DAU8ITJ3YG54
