using HouseRules.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HouseRules.Data;
using HouseRules.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace HouseRules.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChoreController : ControllerBase
{
    private HouseRulesDbContext _dbContext;

    public ChoreController(HouseRulesDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet]
    [Authorize]
    public IActionResult Get()
    {
        return Ok(_dbContext.Chores.ToList());
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetById(int id)
    {
        Chore chore = _dbContext
            .Chores
            .Include(c => c.ChoreAssignments)
            .Include(c => c.ChoreCompletions)
            .SingleOrDefault(c => c.Id == id);

        if (chore == null)
        {
            return NotFound();
        }

        return Ok(chore);
    }

    [HttpPost("{id}/complete")]
    [Authorize]
    public IActionResult CompleteChore(int id, int userId)
    {
        Chore foundChore = _dbContext.Chores.SingleOrDefault(c => c.Id == id);
        UserProfile foundUser = _dbContext.UserProfiles.SingleOrDefault(up => up.Id == userId);

        if (foundChore == null || foundUser == null)
        {
            return NotFound();
        }

        ChoreCompletion completed = new()
        {
            UserProfileId = foundChore.Id,
            ChoreId = foundUser.Id,
            CompletedOn = DateTime.Now
        };

        _dbContext.ChoreCompletions.Add(completed);
        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public IActionResult CreateChore(Chore chore)
    {
        _dbContext.Chores.Add(chore);
        _dbContext.SaveChanges();
        return Created($"/api/chore/{chore.Id}", chore);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult UpdateChore(Chore chore, int id)
    {
        Chore choreToUpdate = _dbContext.Chores.SingleOrDefault(c => c.Id == id);

        if (choreToUpdate == null) 
        {
            return NotFound();
        }
        else if (choreToUpdate.Id != id)
        {
            return BadRequest();
        }

        choreToUpdate.Name = chore.Name;
        choreToUpdate.Difficulty = chore.Difficulty;
        choreToUpdate.ChoreFrequencyDays = chore.ChoreFrequencyDays;
        
        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteChore(int id)
    {
        Chore choreToDelete = _dbContext.Chores.SingleOrDefault(c => c.Id == id);

        if (choreToDelete == null)
        {
            return NotFound();
        }

        _dbContext.Remove(choreToDelete);
        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpPost("{id}/assign")]
    [Authorize(Roles = "Admin")]
    public IActionResult AssignChore(int id, int userId)
    {
        Chore foundChore = _dbContext.Chores.SingleOrDefault(c => c.Id == id);
        UserProfile foundUser = _dbContext.UserProfiles.SingleOrDefault(up => up.Id == userId);

        if (foundChore == null || foundUser == null)
        {
            return NotFound();
        };

        ChoreAssignment choreAssignment = new()
        {
            UserProfileId = foundUser.Id,
            ChoreId = foundChore.Id
        };

        _dbContext.ChoreAssignments.Add(choreAssignment);
        _dbContext.SaveChanges();
        return NoContent();
    }

    [HttpPost("{id}/unassign")]
    [Authorize(Roles = "Admin")]
    public IActionResult UnassignChore(int id, int userId)
    {
        Chore foundChore = _dbContext.Chores.SingleOrDefault(c => c.Id == id);
        UserProfile foundUser = _dbContext.UserProfiles.SingleOrDefault(up => up.Id == userId);
        ChoreAssignment foundAssignment = _dbContext.ChoreAssignments.SingleOrDefault(ca => ca.ChoreId == id && ca.UserProfileId == userId);

        if (foundChore == null || foundUser == null || foundAssignment == null)
        {
            return NotFound();
        };

        if (foundAssignment.ChoreId != foundChore.Id || foundAssignment.UserProfileId != foundUser.Id)
        {
            return BadRequest();
        }

        _dbContext.ChoreAssignments.Remove(foundAssignment);
        _dbContext.SaveChanges();
        return NoContent();
    }
}