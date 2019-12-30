import memcache
# 建立连接
mc = memcache.Client(['127.0.0.1:11211'], debug=True)


# set
def set_key(key=None, val=None, expiry_time=60*3):
    if key and val:
        mc.set(key, val, expiry_time)
        return True
    return False

# get
def get_key(key=None):
    if key:
        return mc.get(key)
    return None

# delete  默认返回是None
def delete_key(key=None):
    if key:
        mc.delete(key)
        return True
    return False