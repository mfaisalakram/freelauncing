package oopfinal;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Formatter;
import java.util.Scanner;

public class Terminal_Test 
{
    private static Formatter output; 
    
    
    public static void main(String[] args) throws FileNotFoundException 
    {       
        Scanner input = new Scanner(System.in);
        int continue1=0;
        while(continue1!=-1) {
        System.out.println("To enter Data press '00' to open Display menu press '01' ");
        if(input.hasNext("00"))
        {
                System.out.println("For Undergraduate Student enter 1\nFor Graduate Student enter 2\n");
              
                input.nextInt();
                
            
                if(input.hasNext("1"))
                {
                	
                	String name ;
                    float GPA;
                    int Sem_no;
                    float fee;
                    
                    System.out.print("Enter Name :");
                    input.next();
                    name=input.next();
                   
      
              
                    System.out.print("Enter  GPA:");
                    GPA=input.nextFloat();
                    System.out.print("Enter Semester:");
                    Sem_no=input.nextInt();
                    System.out.print("Enter Fee:");
                    fee=input.nextFloat();
                    
                    
                    
                    UND_Student student=new UND_Student(name,GPA, Sem_no,fee);
                    
                    PEEF peef=new PEEF();
                    PWWB pwwb=new PWWB();
                    ResearchFellowship  researchFellowship=new ResearchFellowship();
                    
                    
                    
                    String statusPeef =peef.getScholership(student);
                    String statuspwwb =pwwb.getScholership(student);
                    String statusresearch =researchFellowship.getScholership(student);
                
                    
                    
                    try
                    {
                    	
                    	
                                  	
                        output = new Formatter("Under-Grdaute.txt");
                        output.format("%s %.0f %d %.0f\n",name,GPA,Sem_no,fee);
                        output.close();
                        
              
                        
                                    
                        
                        output = new Formatter("undergradute-scholarships.txt");
                        output.format("PEEF %s %.1f %d %.1f %s \n",name,GPA,Sem_no,fee,statusPeef);
                        output.format("PWWB %s %.1f %d %.1f %s \n",name,GPA,Sem_no,fee,statuspwwb);
                        output.format("Research FellowShip %s %.1f %d %.1f %s \n",name,GPA,Sem_no,fee,statusresearch);                                 
                        output.close();
                        
                        
                        
                        
                    }
                    catch(SecurityException securityException)
                    {
                        System.err.println("Write permission denied. Terminating");
                        System.exit(1);
                    }
                    catch(FileNotFoundException fileNotFoundException)
                    {
                        System.err.println("Error opening file. Terminating");
                        System.exit(1);
                    }
                    
                   
                	
                	
                 //   openGradFile();
                  //  WriteToFile();
                   // closeFile();
                } else if(input.hasNext("2"))
                {
                	
                	String name ;
                    float GPA;
                    int Sem_no;
                    float fee;
                    
                    System.out.print("Enter Name :");
                    input.next();
                    name=input.next();
                   
      
              
                    System.out.print("Enter  GPA:");
                    GPA=input.nextFloat();
                    System.out.print("Enter Semester:");
                    Sem_no=input.nextInt();
                    System.out.print("Enter Fee:");
                    fee=input.nextFloat();
                    
                    
                    
                    
                    GRAD_Student student=new GRAD_Student(name,GPA, Sem_no,fee);
                    PEEF peef=new PEEF();
                    
                    String status =peef.getScholership(student);
                    PWWB pwwb=new PWWB();
                    ResearchFellowship  researchFellowship=new ResearchFellowship();
                    
                    
                    
                    String statusPeef =peef.getScholership(student);
                    String statuspwwb =pwwb.getScholership(student);
                    String statusresearch =researchFellowship.getScholership(student);
                
                    
                    try
                    {
                        output = new Formatter("Grdaute.txt");
                        output.format("%s %.1f %d %.0f\n",name,GPA,Sem_no,fee);
                        output.close();
                        
                        
                        
                   

                        output = new Formatter("Gradute-scholarships.txt");
                        output.format("PEEF %s %.1f %d %.1f %s \n",name,GPA,Sem_no,fee,statusPeef);
                        output.format("PWWB %s %.1f %d %.1f %s \n",name,GPA,Sem_no,fee,statuspwwb);
                        output.format("Research FellowShip %s %.1f %d %.1f %s \n",name,GPA,Sem_no,fee,statusresearch);                                 
                        output.close();
                        
                        
                        
                    }
                    catch(SecurityException securityException)
                    {
                        System.err.println("Write permission denied. Terminating");
                        System.exit(1);
                    }
                    catch(FileNotFoundException fileNotFoundException)
                    {
                        System.err.println("Error opening file. Terminating");
                        System.exit(1);
                    }
                	
                	
                	
                	
                 //   openUndGradFile();
                 //   WriteToFile();
                   // closeFile();
                }
        }
        else if(input.hasNext("01"))
        {

        	
       
        	
       int choice=0; 	
        System.out.println("1.	Enter 1 to display data of all student.");
        System.out.println("2.	Enter 2 to display data of graduate students");
        System.out.println("3.	Enter 3 to display data of undergraduate students");
        System.out.println("4.	Enter 4 to display fee and stipend (if any) of graduate students.");
        System.out.println("5.	Enter 5 to display fee and stipend (if any) of undergraduate students.");
        System.out.println("Enter the choice: ");
        input.next();
        choice=input.nextInt();
        if(choice==1) {
        	
        	
        Scanner file = new Scanner(new File("Under-Grdaute.txt"));
        
   	   System.out.println("------------------------------------");
 	   System.out.println("All Students Data:"); 
    	   System.out.println("------------------------------------");
            while(file.hasNext()){   	
            	
                String data = file.nextLine();
                System.out.println(data);               
 
            }
            
        file = new Scanner(new File("Grdaute.txt"));
            
            while(file.hasNext())
            {
                String data = file.nextLine();
                System.out.println(data);
            }           
 
            
     	   System.out.println("------------------------------------");        	
        }else if(choice==2) {
        	
           	
            Scanner file = new Scanner(new File("Grdaute.txt"));
            
       	   System.out.println("------------------------------------");
    	   System.out.println("Gradute Student Data:"); 
       	   System.out.println("------------------------------------");
                while(file.hasNext())
                {
                    String data = file.nextLine();
                    System.out.println(data);
                }           
     
                     	
        }else if(choice ==3) {
        	
        	  Scanner file = new Scanner(new File("undergradute-scholarships.txt"));
        	   System.out.println("------------------------------------");
        	   System.out.println("Undergradute Scholarship Data:"); 
           	   System.out.println("------------------------------------");
              while(file.hasNext()){   	
              	
                  String data = file.nextLine();
                  System.out.println(data);               
   
              }             	
        	
        }else if(choice==4) {

      	  Scanner file = new Scanner(new File("graduate-scholarships.txt"));
            
   	   System.out.println("------------------------------------");
	   System.out.println("Gradute Scholarship Data:"); 
   	   System.out.println("------------------------------------");
            while(file.hasNext()){   	
          	
                String data = file.nextLine();
                System.out.println(data);               
 
            }    
            System.out.println("------------------------------------");
        	
        	
        }else if (choice==5) {
        	
        	 Scanner file = new Scanner(new File("undergraduate-scholarships.txt"));
             
             while(file.hasNext()){   	
             	
                 String data = file.nextLine();
                 System.out.println(data);               
  
             }       
         	
        }else {
        
            System.out.println("invalid input");               
            
        }
        
        
        
        
        
        }
        
       
        System.out.println("Press 1 to continue and -1 to terminate");
         continue1=input.nextInt();
        
  
        }
        
    }
    public static void openUndGradFile()
    {
        try
        {
            output = new Formatter("Under-Grdaute.txt");
        }
        catch(SecurityException securityException)
        {
            System.err.println("Write permission denied. Terminating");
            System.exit(1);
        }
        catch(FileNotFoundException fileNotFoundException)
        {
            System.err.println("Error opening file. Terminating");
            System.exit(1);
        }
    }
    
    
     public static void openGradFile()
    {
        try
        {
            output = new Formatter("Grdaute.txt");
        }
        catch(SecurityException securityException)
        {
            System.err.println("Write permission denied. Terminating");
            System.exit(1);
        }
        catch(FileNotFoundException fileNotFoundException)
        {
            System.err.println("Error opening file. Terminating");
            System.exit(1);
        }
    }

   
     public static void WriteToFile1()
     {
         Scanner input = new Scanner(System.in);
         System.out.println("Enter your data in the following format:\nName CGPA SemesterNumber Fee");
         while(input.hasNext())
         {
             if(input.hasNext("-1"))
             {
                 break;
             }
             else if(input.hasNext("1"))
             {
                 int choice = input.nextInt();
                 output.format("%s %f %d %d\n",input.next(),input.nextDouble(),input.nextInt(),input.nextInt());
             
             System.out.println("Enter 1 to continue and -1 to terminate");
             }
         }
     }
     
    public static void WriteToFile()
    {
        Scanner input = new Scanner(System.in);
        System.out.println("Enter your data in the following format:\nName CGPA SemesterNumber Fee");
        while(input.hasNext())
        {
            if(input.hasNext("-1"))
            {
                break;
            }
            else if(input.hasNext("1"))
            {
                int choice = input.nextInt();
                output.format("%s %f %d %d\n",input.next(),input.nextDouble(),input.nextInt(),input.nextInt());
            
            System.out.println("Enter 1 to continue and -1 to terminate");
            }
        }
    }
    
    public static void closeFile()
    {
        if(output != null)
            output.close();
    }
}