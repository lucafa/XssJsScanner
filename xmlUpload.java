

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class xmlUpload
 */
@WebServlet("/xmlUpload")
public class xmlUpload extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public xmlUpload() {
        super();
        // TODO Auto-generated constructor stub
    }
public String getDate(){
	Date date = new Date();
    long diff = date.getTime();
	String nomefile = Long.toString(diff); 
	return nomefile;
	
}
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub 
		//Ricavo il path della servlet dove salvare i file
		ServletContext servletContext = getServletContext();
		String contextPath = servletContext.getRealPath(File.separator);
		//Creo un nome file casuale basato su un valore temporale
		String nomefile= getDate();
		String[] myData = request.getParameterValues("name[]");
      	File folder = new File((contextPath+"upload"));
		File[] listOfFiles = folder.listFiles();
        //Sposto il file vecchio su una directory di backup
        for (File file : listOfFiles) {
        	if (file.isFile()) {
        		file.renameTo(new File(contextPath + "/upload/db/" + nomefile + ".xml"));
        		//file.renameTo(new File(contextPath + "/upload/db/" + file.getName()));
        		//file.renameTo(new File(contextPath + "\\upload\\db\\" + file.getName()));
                	}
        }
        //String Filename= contextPath + "\\upload\\" + nomefile + ".xml"; WINDOWS VERSION
		//String Filename= contextPath + "/upload/" + nomefile + ".xml";
		String Filename= contextPath + "/upload/reportXML.xml";
		PrintWriter writer = new PrintWriter(Filename);
		
		PrintWriter responsePost = response.getWriter();
		responsePost.println(nomefile + ".xml");
		
		for (int i=0; i<(myData.length); i++) {
						writer.write(myData[i]);
						System.out.println(myData[i]);
		}
		writer.close();
						System.out.println(Filename);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
