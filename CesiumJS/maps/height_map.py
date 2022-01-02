
import rasterio
import numpy as np
#from rasterio.plot import show


width, height = 1000, 1000

# Create an 2D grid [-5, 5], and an circular hole with radius of 2 in the center
x = np.linspace(-5, 5, width)
y = np.linspace(-5, 5, height)
xv, yv = np.meshgrid(x, y)

f = np.zeros((width, height)).astype(np.float32)
for i in range(width):
    for j in range(height):
        if xv[i,j]**2 + yv[i,j]**2 < 4:
            f[i, j] = -300
        else:
            f[i, j] = -np.inf #-3.4028235e+38

#                                       W, S, E, N, w, h
trans = rasterio.transform.from_bounds(-79.477199, 46.324303, -79.451373, 46.338063, width, height)
#trans = rasterio.transform.from_bounds(80, 30, 120, 50, width, height)
with rasterio.open('./test.tiff', 'w', driver='GTiff',
                   height=height, width=width, count=1, 
                   dtype=f.dtype, transform=trans, 
                   crs=rasterio.crs.CRS.from_epsg(4326)) as dst:
    dst.write(f, indexes=1)

from rasterio.plot import show
test = rasterio.open('test.tiff')
show(test)


img = rasterio.open(r'ZionNationalPark.tiff')
show(img)