/**
 * 
 */
package org.dataportal.csw;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

import org.apache.log4j.Logger;

/**
 * @author Micho Garcia
 * 
 */
public class Catalog {

	private static Logger logger = Logger.getLogger(Catalog.class);

	private static URL URL;

	/**
	 * 
	 * @param URL
	 *            String with url csw server
	 * @throws MalformedURLException
	 */
	public Catalog(String URL) throws MalformedURLException {
		Catalog.URL = new URL(URL);
		logger.debug("URL to connect: " + URL);
	}

	/**
	 * 
	 * @param cswQuery
	 * @return
	 * @throws IOException 
	 * @throws Exception
	 */
	public InputStream sendCatalogRequest(String cswQuery) throws IOException  {

		URLConnection conexionCatalog = Catalog.URL.openConnection();

		conexionCatalog.setDoOutput(true);
		conexionCatalog.setRequestProperty("Accept", "*/*");
		conexionCatalog.setRequestProperty("Content-type", "application/xml");

		OutputStreamWriter cswParameters = new OutputStreamWriter(
				conexionCatalog.getOutputStream());
		cswParameters.write(cswQuery);
		cswParameters.flush();

		InputStream isCswResponse = conexionCatalog.getInputStream();
		
		return isCswResponse;
	}
}
