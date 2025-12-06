import * as stagesRepository from '../../src/repositories/stages.repository';
import * as stagesService from '../../src/service/stages.service';
jest.mock("../../src/repositories/stages.repository")



describe("Order stages test Suites",()=>{

     afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should fetch all the orders stages",async()=>{
    const mockStages=[
      {
             OrderId: 2006,
        StageName: "Baking",
        Status: "Completed",
        StartedAt: "2025-10-20T09:00:00.000Z",
        
        Notes: "Baked successfully."
      },
      {
             OrderId: 2006,
        StageName: "Decorating",
        Status: "In Progress",
        StartedAt: "2025-10-20T12:00:00.000Z",
        CompletedAt: null,
        Notes: "Adding final touches."
      }
    ];
    
    (stagesRepository.getAllStages as jest.Mock).mockResolvedValue(mockStages);
    const res = await  stagesService.getStages();
    expect(res).toEqual(mockStages);

  })

  it("Should add new stage to an order",async()=>{
    const newStageData={
        OrderId: 2007,
        StageName: "Packaging",
        Status: "Pending",
        StartedAt: null,
        CompletedAt: null,
        Notes: "Awaiting packaging."
    };

    (stagesRepository.addStage as jest.Mock).mockResolvedValue(newStageData);

    const res = await stagesService.addNewStage(newStageData as any);
    expect(res).toEqual(newStageData);
  });




  it("Should fetch stages by order id",async()=>{
    const mockStagesByOrderId={
             OrderId: 2006,
        StageName: "Baking",
        Status: "Completed",
        StartedAt: "2025-10-20T09:00:00.000Z",
        CompletedAt: "2025-10-20T10:00:00.000Z",
        Notes: "Baked successfully."
      };

      (stagesRepository.getStageById as jest.Mock).mockResolvedValue(mockStagesByOrderId);

      const res = await stagesService.getStageDetails(2006);
      expect(res).toEqual(mockStagesByOrderId);

    })

    it("Should fail with nonexistent stage Id", async()=>{
      
      
      (stagesRepository.getStageById as jest.Mock).mockResolvedValue(null)

      
      await expect(stagesService.getStageDetails(2000009))
      .rejects
      .toThrow("Stage not found")
    })

    it("Should update the stage status ",async()=>{
      const mockStage={

        Id:2003,
        OrderId: 2006,
        StageName: "Baking",
        Status: "Baking",
        StartedAt: "2025-10-20T09:00:00.000Z",
        CompletedAt: "2025-10-20T10:00:00.000Z",
        Notes: "Baked successfully."
      };

      (stagesRepository.getStageById as jest.Mock).mockResolvedValue(mockStage);
      (stagesRepository.updateStageStatus as jest.Mock).mockResolvedValue(
        {
          ...mockStage,
          Status: "Completed"
        }
        );
    
      const results = await stagesService.changeStageStatus(2003,"Completed")

      expect(results).toEqual({message:'Stage status updated successfully'})

    })

    it.skip("It should delete Stage by stage id",async ()=>{
       const mockStage={
        Id:2003,
        OrderId: 2006,
        StageName: "Baking",
        Status: "Baking",
        StartedAt: "2025-10-20T09:00:00.000Z",
        CompletedAt: "2025-10-20T10:00:00.000Z",
        Notes: "Baked successfully."
      };

      (stagesRepository.getStageById as jest.Mock).mockResolvedValue(mockStage);
      (stagesRepository.deleteStageById as jest.Mock).mockResolvedValue(mockStage)


      const response = await stagesService.removeStage(2003);

      expect(response).toEqual({message:'Stage removed successfully'})

    })

    it("Should fail for non-existent stage", async()=>{

      (stagesRepository.getStageById as jest.Mock).mockResolvedValue(null);
       await expect(stagesService.removeStage(200))
       .rejects
       .toThrow('Stage not found');        
    })
    
    


})